const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function fixture() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../web/monitor.js"), "utf8"), context);
  const rendered = [];
  let state = { revision: 1, step: 0, history: [] };
  let monitor = { sequence: 0, active: false };
  let reads = 0;
  const bridge = new context.window.MonitorBridge({
    render: value => rendered.push(value),
    getState: async () => { reads++; return state; },
  });
  bridge.getMonitorState = async () => monitor;
  return { bridge, rendered, setState: value => state = value,
    setMonitor: value => monitor = value, reads: () => reads };
}

test("external Evaluate refreshes history with unchanged Monitor sequence", async () => {
  const f = fixture();
  await f.bridge.poll();
  const evaluated = { revision: 2, step: 1, history: [{ instruction: "RH", y: 0.2 }] };
  f.setState(evaluated);
  await f.bridge.poll();
  await f.bridge.poll();
  assert.equal(f.rendered.length, 2);
  assert.equal(f.rendered[1], evaluated);
});

test("external Reset refreshes at step zero and clears graph history", async () => {
  const f = fixture();
  await f.bridge.poll();
  const reset = { revision: 2, step: 0, history: [] };
  f.setState(reset);
  await f.bridge.poll();
  assert.equal(f.rendered[1], reset);
});

test("active Monitor takes precedence until cleared, then latest emulator renders", async () => {
  const f = fixture();
  await f.bridge.poll();
  const monitored = { mode: "monitor", y: 0.7 };
  f.setMonitor({ sequence: 1, active: true, state: monitored });
  await f.bridge.poll();
  const reset = { revision: 3, step: 0, history: [] };
  f.setState(reset);
  await f.bridge.poll();
  assert.equal(f.rendered.length, 2);
  assert.equal(f.rendered[1], monitored);
  assert.equal(f.reads(), 1);
  f.setMonitor({ sequence: 2, active: false });
  await f.bridge.poll();
  assert.equal(f.rendered[2], reset);
});

test("Monitor exit renders even if emulator revision is unchanged", async () => {
  const f = fixture();
  await f.bridge.poll();
  f.setMonitor({ sequence: 1, active: true, state: { mode: "monitor" } });
  await f.bridge.poll();
  f.setMonitor({ sequence: 2, active: false });
  await f.bridge.poll();
  assert.equal(f.rendered.length, 3);
  assert.equal(f.rendered[2].revision, 1);
});
