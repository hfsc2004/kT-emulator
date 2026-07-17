// Scripted tutorial terminal. This is intentionally not a real shell.

class VirtualCli {
  constructor({ panel, output, replayButton, modeButton, form, input }) {
    this.panel = panel;
    this.output = output;
    this.replayButton = replayButton;
    this.modeButton = modeButton;
    this.form = form;
    this.input = input;
    this.script = [];
    this.timer = null;
    this.typingEnabled = false;

    this.replayButton.addEventListener("click", () => this.play(this.script));
    this.modeButton.addEventListener("click", () => this.toggleTyping());
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.runTypedCommand();
    });
  }

  play(script = []) {
    this.stop();
    this.script = script;
    this.output.textContent = "";
    if (!script.length) {
      this.panel.hidden = true;
      this.setTyping(false);
      return;
    }
    this.panel.hidden = false;
    this.typeBlock(0);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggleTyping() {
    this.setTyping(!this.typingEnabled);
  }

  setTyping(enabled) {
    this.typingEnabled = enabled;
    this.form.hidden = !enabled;
    this.modeButton.textContent = enabled ? "Disable typing" : "Enable typing";
    if (enabled) {
      this.input.focus();
    }
  }

  typeBlock(index) {
    if (index >= this.script.length) {
      return;
    }
    const block = this.script[index];
    const text = this.formatBlock(block);
    const instant = Boolean(block.output);
    this.typeText(text, instant, () => {
      this.timer = setTimeout(() => this.typeBlock(index + 1), 120);
    });
  }

  formatBlock(block) {
    if (block.output) {
      return `${block.output}\n`;
    }
    if (block.code) {
      return `${block.code}\n`;
    }
    const prompt = block.prompt ? `${block.prompt} ` : "";
    return `${prompt}${block.text || ""}\n`;
  }

  typeText(text, instant, done) {
    if (instant) {
      this.append(text);
      done();
      return;
    }

    let index = 0;
    const tick = () => {
      this.append(text[index]);
      index += 1;
      if (index < text.length) {
        this.timer = setTimeout(tick, text[index - 1] === "\n" ? 90 : 12);
      } else {
        done();
      }
    };
    tick();
  }

  append(text) {
    this.output.textContent += text;
    this.output.scrollTop = this.output.scrollHeight;
  }

  runTypedCommand() {
    const command = this.input.value.trim();
    this.input.value = "";
    if (!command) {
      return;
    }
    this.stop();
    this.append(`demo@ktram:~$ ${command}\n`);
    if (command === "clear") {
      this.output.textContent = "";
      return;
    }
    this.append(`${this.responseFor(command)}\n`);
  }

  responseFor(command) {
    const responses = {
      help: "Try: help, ls, cat demo.py, python demo.py, clear",
      ls: "demo.py",
      "cat demo.py": "from ktram_neural_core import Core\n# Demo file shown in the scripted lesson.",
      "python demo.py": "start y:   +0.0000\ntrained y: +0.1372\nGa/Gb:     0.0584 / 0.0443",
    };
    return responses[command] || `Command not available in this virtual tutorial shell: ${command}`;
  }
}

window.VirtualCli = VirtualCli;
