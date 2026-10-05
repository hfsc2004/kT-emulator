class MonitorBridge {
  constructor({ render, getState }) {
    this.render = render;
    this.getState = getState;
    this.sequence = null;
    this.revision = null;
    this.mode = null;
    this.polling = false;
    this.timer = null;
  }

  start() {
    this.stop();
    this.timer = window.setInterval(() => this.poll(), 500);
    this.poll();
  }

  stop() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  async poll() {
    if (this.polling) return;
    this.polling = true;
    try {
      const monitor = await this.getMonitorState();
      if (monitor.active && monitor.state) {
        if (this.mode !== "monitor" || monitor.sequence !== this.sequence) {
          this.render(monitor.state);
          this.sequence = monitor.sequence;
          this.mode = "monitor";
        }
        return;
      }
      const state = await this.getState();
      if (this.mode !== "emulator" || state.revision !== this.revision) {
        this.render(state);
        this.revision = state.revision;
        this.mode = "emulator";
      }
    } catch (_error) {
      // Monitor polling is best-effort; local emulator controls should keep working.
    } finally {
      this.polling = false;
    }
  }

  async getMonitorState() {
    const response = await fetch("/api/monitor/state");
    return response.json();
  }
}

window.MonitorBridge = MonitorBridge;
