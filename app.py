#!/usr/bin/env python3
"""Browser UI for exploring the kT-RAM single-synapse emulator."""

from __future__ import annotations

import errno
import gc
import json
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from ktram_neural_core import Core, INSTRUCTIONS

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "web"
Z = (0,)


class EmulatorSession:
    def __init__(self) -> None:
        self.reset()

    def reset(
        self,
        *,
        seed: int = 1,
        model: str = "float",
        init: str = "medium",
        read_noise: float = 0.02,
        start_y: float | None = None,
    ) -> dict:
        self.core = Core(
            1,
            1,
            spaces_per_lane=1,
            num_lanes=1,
            model=model,
            init=init,
            seed=seed,
            read_noise=read_noise,
        )
        self.model = model
        self.init = init
        self.seed = seed
        self.read_noise = read_noise
        self.step = 0
        self.history: list[dict] = []
        if start_y is not None:
            self.core.set_start_y(0, Z, start_y)
        return self.snapshot("reset", 0.0)

    def evaluate(self, instruction: str, noise: float = 0.0) -> dict:
        if instruction not in INSTRUCTIONS:
            raise ValueError(f"Unknown instruction: {instruction}")
        y = self.core.evaluate(Z, instruction, noise=noise)
        self.step += 1
        return self.snapshot(instruction, y)

    def cycle(self, count: int, read: str, feedback: str, noise: float = 0.0) -> dict:
        count = max(1, min(count, 500))
        for _ in range(count):
            self.evaluate(read, noise=noise)
            state = self.evaluate(feedback, noise=0.0)
        return state

    def sample(self, count: int, instruction: str, noise: float = 0.0) -> dict:
        count = max(1, min(count, 1000))
        values = [self.evaluate(instruction, noise=noise)["y"] for _ in range(count)]
        state = self.snapshot(f"{instruction} x{count}", values[-1])
        state["sample"] = {
            "count": count,
            "mean": sum(values) / len(values),
            "positive": sum(1 for value in values if value >= 0.0),
            "values": values[:80],
        }
        return state

    def snapshot(self, instruction: str, y: float) -> dict:
        ga, gb = self.core.read_gab(0, Z)
        point = {
            "step": self.step,
            "instruction": instruction,
            "y": y,
            "ga": ga,
            "gb": gb,
            "magnitude": ga + gb,
            "model": self.model,
            "init": self.init,
            "seed": self.seed,
            "read_noise": self.read_noise,
        }
        if instruction not in {"reset", "state"}:
            self.history.append(point)
            self.history = self.history[-240:]
        state = dict(point)
        state["history"] = self.history
        return state


SESSION = EmulatorSession()


class EmulatorHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.address_string()} - {fmt % args}")

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            self.send_json(SESSION.snapshot("state", SESSION.core.lane(0).y))
            return

        path = "index.html" if parsed.path == "/" else parsed.path.lstrip("/")
        target = (STATIC / path).resolve()
        if not str(target).startswith(str(STATIC.resolve())) or not target.exists():
            self.send_error(404)
            return

        content_type = "text/html"
        if target.suffix == ".css":
            content_type = "text/css"
        elif target.suffix == ".js":
            content_type = "application/javascript"

        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        try:
            data = self.read_json()
            if parsed.path == "/api/reset":
                state = SESSION.reset(
                    seed=int(data.get("seed", 1)),
                    model=str(data.get("model", "float")),
                    init=str(data.get("init", "medium")),
                    read_noise=float(data.get("read_noise", 0.02)),
                    start_y=self.optional_float(data.get("start_y")),
                )
            elif parsed.path == "/api/evaluate":
                state = SESSION.evaluate(
                    str(data.get("instruction", "FF")),
                    noise=float(data.get("noise", 0.0)),
                )
            elif parsed.path == "/api/cycle":
                state = SESSION.cycle(
                    int(data.get("count", 1)),
                    str(data.get("read", "FF")),
                    str(data.get("feedback", "RH")),
                    noise=float(data.get("noise", 0.0)),
                )
            elif parsed.path == "/api/sample":
                state = SESSION.sample(
                    int(data.get("count", 20)),
                    str(data.get("instruction", "FFLV")),
                    noise=float(data.get("noise", 0.0)),
                )
            else:
                self.send_error(404)
                return
            self.send_json(state)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=400)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    @staticmethod
    def optional_float(value: object) -> float | None:
        if value in (None, ""):
            return None
        return float(value)

    def send_json(self, data: dict, status: int = 200) -> None:
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Run the kT-RAM emulator UI")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--no-browser", action="store_true", help="do not open the UI automatically")
    args = parser.parse_args()

    server = None
    for port in range(args.port, args.port + 20):
        try:
            server = EmulatorHTTPServer((args.host, port), Handler)
            args.port = port
            break
        except OSError as exc:
            if exc.errno != errno.EADDRINUSE:
                raise
    if server is None:
        raise SystemExit(f"No available port from {args.port} to {args.port + 19}")

    url = f"http://{args.host}:{args.port}"
    print(f"kT emulator UI: {url}", flush=True)
    if not args.no_browser:
        print("Opening browser...", flush=True)
        threading.Timer(0.4, webbrowser.open, args=(url,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping kT emulator UI...", flush=True)
    finally:
        server.shutdown()
        server.server_close()
        SESSION.history.clear()
        gc.collect()
        print("kT emulator UI stopped.", flush=True)


if __name__ == "__main__":
    main()
