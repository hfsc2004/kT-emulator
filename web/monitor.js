class MonitorBridge {
  constructor({ render, getState }) {
    this.render = render;
    this.getState = getState;
    this.sequence = 0;
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
    try {
      const monitor = await this.getMonitorState();
      if (monitor.sequence <= this.sequence) {
        return;
      }
      this.sequence = monitor.sequence;
      if (monitor.active && monitor.state) {
        this.render(monitor.state);
        return;
      }
      this.render(await this.getState());
    } catch (_error) {
      // Monitor polling is best-effort; local emulator controls should keep working.
    }
  }

  async getMonitorState() {
    const response = await fetch("/api/monitor/state");
    return response.json();
  }
}

window.MonitorBridge = MonitorBridge;
