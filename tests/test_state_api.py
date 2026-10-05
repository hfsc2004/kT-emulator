import json
import threading
import unittest
import urllib.request
from unittest.mock import patch

import app


class StateApiTests(unittest.TestCase):
    def setUp(self):
        self.session = app.EmulatorSession()
        self.monitor = app.MonitorSession()
        self.patches = [patch.object(app, "SESSION", self.session),
                        patch.object(app, "MONITOR", self.monitor)]
        for replacement in self.patches:
            replacement.start()
        self.server = app.EmulatorHTTPServer(("127.0.0.1", 0), app.Handler)
        self.thread = threading.Thread(target=self.server.serve_forever)
        self.thread.start()
        self.url = f"http://127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        for replacement in reversed(self.patches):
            replacement.stop()

    def request(self, path, payload=None):
        data = None if payload is None else json.dumps(payload).encode()
        request = urllib.request.Request(self.url + path, data=data,
                                         headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(request) as response:
            return json.load(response)

    def test_external_evaluate_and_read_only_refresh(self):
        before = self.request("/api/state")
        result = self.request("/api/evaluate", {"instruction": "RH"})
        with patch.object(self.session.core, "evaluate", side_effect=AssertionError("read evaluated")):
            current = self.request("/api/state")
            again = self.request("/api/state")
        self.assertGreater(current["revision"], before["revision"])
        self.assertEqual(current["revision"], result["revision"])
        self.assertEqual(current["history"], result["history"])
        self.assertEqual(current["step"], 1)
        self.assertEqual(current, again)

    def test_external_reset_advances_revision_even_at_step_zero(self):
        before = self.request("/api/state")
        reset = self.request("/api/reset", {"seed": 12, "start_y": 0.45})
        current = self.request("/api/state")
        self.assertGreater(current["revision"], before["revision"])
        self.assertEqual(current["revision"], reset["revision"])
        self.assertEqual(current["step"], 0)
        self.assertEqual(current["history"], [])
        self.request("/api/evaluate", {"instruction": "FF"})
        self.request("/api/reset", {})
        self.assertEqual(self.request("/api/state")["history"], [])

    def test_emulator_commands_preserve_monitor_stream(self):
        self.request("/api/monitor/event", {"y": 0.2, "ga": 0.06, "gb": 0.04})
        before = self.request("/api/monitor/state")
        self.request("/api/evaluate", {"instruction": "RH"})
        self.request("/api/reset", {})
        self.assertEqual(self.request("/api/monitor/state"), before)
        self.request("/api/monitor/reset", {})
        self.assertFalse(self.request("/api/monitor/state")["active"])


if __name__ == "__main__":
    unittest.main()
