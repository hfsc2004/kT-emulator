"""External monitor stream for driving the browser visuals from user programs."""

from __future__ import annotations

import threading
import time


class MonitorSession:
    """Stores external state snapshots posted by user programs."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self.reset()

    def reset(self) -> dict:
        with self._lock:
            self.step = 0
            self.sequence = getattr(self, "sequence", -1) + 1
            self.active = False
            self.history: list[dict] = []
            self.state: dict | None = None
            return self.current()

    def current(self) -> dict:
        with self._lock:
            return {
                "active": self.active,
                "sequence": self.sequence,
                "state": self.state,
            }

    def ingest(self, payload: dict) -> dict:
        with self._lock:
            data = payload.get("state", payload)
            if not isinstance(data, dict):
                raise ValueError("Monitor event must be a JSON object")

            y = float(data["y"])
            ga = float(data["ga"])
            gb = float(data["gb"])
            step = int(data.get("step", self.step + 1))
            instruction = str(data.get("instruction") or data.get("label") or "external")
            source = str(data.get("source") or payload.get("source") or "external")
            label = str(data.get("label") or instruction)
            magnitude = float(data.get("magnitude", ga + gb))

            self.step = step
            point = {
                "mode": "monitor",
                "step": step,
                "instruction": instruction,
                "label": label,
                "source": source,
                "y": y,
                "ga": ga,
                "gb": gb,
                "magnitude": magnitude,
                "model": str(data.get("model", "external")),
                "init": str(data.get("init", "monitor")),
                "seed": int(data.get("seed", 0)),
                "read_noise": float(data.get("read_noise", 0.0)),
                "updated_at": time.time(),
            }
            self.history.append(point)
            self.history = self.history[-1000:]
            state = dict(point)
            state["history"] = self.history
            self.state = state
            self.sequence += 1
            self.active = True
            return state

    def ingest_series(self, payload: dict) -> dict:
        events = payload.get("events")
        if not isinstance(events, list) or not events:
            raise ValueError("Monitor series requires a non-empty events list")
        if payload.get("reset"):
            self.reset()
        state = None
        for event in events[:1000]:
            if not isinstance(event, dict):
                raise ValueError("Every monitor series event must be a JSON object")
            state = self.ingest({**event, "source": event.get("source", payload.get("source", "external"))})
        if state is None:
            raise ValueError("Monitor series did not contain any events")
        return state
