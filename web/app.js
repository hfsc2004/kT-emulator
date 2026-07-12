// UI wrapper for Knowm Inc.'s ktram-neural-core emulator.
// ktram-neural-core package metadata labels the emulator software as MIT licensed.
// That license does not grant rights to Knowm hardware, devices, patents, or methods.

const instructions = ["FF", "FFLV", "RF", "RFLV", "FH", "FL", "FU", "FA", "FZ", "RH", "RL", "RU", "RA", "RZ"];
const readInstructions = new Set(["FF", "FFLV", "RF", "RFLV"]);
const lessons = [
  {
    title: "What is this emulator?",
    body: "This is a software sandbox for one kT-RAM neural lane. For now, you are looking at one tiny memory element called a synapse.",
    task: "Start with a balanced synapse. The activation should sit near zero because the two conductances are equal.",
    focus: "activation",
    actions: [{ label: "Load balanced preset", type: "preset", name: "balanced" }],
  },
  {
    title: "One synapse, two conductances",
    body: "The synapse is made from two sides: Ga and Gb. The activation y comes from their balance. If Ga and Gb match, y is near zero.",
    task: "Read the synapse once with FF. Watch y, Ga, and Gb update in the metric boxes.",
    focus: "conductance",
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Run FF", type: "evaluate", instruction: "FF" },
    ],
  },
  {
    title: "Feedback changes memory",
    body: "A read observes the synapse. Feedback nudges it. Running FF then RH is a simple cycle that pushes the stored state upward.",
    task: "Run five FF/RH cycles and watch the activation move step by step.",
    focus: "chart",
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Run 5 cycles", type: "cycle", read: "FF", feedback: "RH", count: 5 },
    ],
  },
  {
    title: "Noise can be useful",
    body: "Low-voltage reads can act like samples. Near y = 0, the sign of the read can flip around like a soft coin toss.",
    task: "Sample FFLV forty times. The positive count shows how often the noisy read landed above zero.",
    focus: "activation",
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40 },
    ],
  },
  {
    title: "Magnitude is stored evidence",
    body: "Magnitude is the total conductance. A higher magnitude means the same weight is harder to move, like a heavier object.",
    task: "Load the low and high magnitude presets. They have the same starting weight, but different stored evidence.",
    focus: "magnitude",
    actions: [
      { label: "Low magnitude", type: "preset", name: "low-magnitude" },
      { label: "High magnitude", type: "preset", name: "high-magnitude" },
    ],
  },
];
let tutorialIndex = 0;

const els = {
  step: document.querySelector("#step"),
  y: document.querySelector("#y"),
  ga: document.querySelector("#ga"),
  gb: document.querySelector("#gb"),
  magnitude: document.querySelector("#magnitude"),
  model: document.querySelector("#model"),
  init: document.querySelector("#init"),
  seed: document.querySelector("#seed"),
  startY: document.querySelector("#start-y"),
  readNoise: document.querySelector("#read-noise"),
  reset: document.querySelector("#reset"),
  instructions: document.querySelector("#instructions"),
  cycleRead: document.querySelector("#cycle-read"),
  cycleFeedback: document.querySelector("#cycle-feedback"),
  cycleCount: document.querySelector("#cycle-count"),
  runCycle: document.querySelector("#run-cycle"),
  noise: document.querySelector("#noise"),
  sampleCount: document.querySelector("#sample-count"),
  sample: document.querySelector("#sample"),
  lastInstruction: document.querySelector("#last-instruction"),
  sampleSummary: document.querySelector("#sample-summary"),
  chart: document.querySelector("#chart"),
  tutorialToggle: document.querySelector("#tutorial-toggle"),
  tutorialPanel: document.querySelector("#tutorial-panel"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialBody: document.querySelector("#tutorial-body"),
  tutorialTask: document.querySelector("#tutorial-task"),
  tutorialActions: document.querySelector("#tutorial-actions"),
  tutorialProgress: document.querySelector("#tutorial-progress"),
  tutorialPrev: document.querySelector("#tutorial-prev"),
  tutorialNext: document.querySelector("#tutorial-next"),
  tutorialRestart: document.querySelector("#tutorial-restart"),
  tutorialExit: document.querySelector("#tutorial-exit"),
};

function fmt(value, digits = 6) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(digits)}`;
}

async function post(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

async function getState() {
  const response = await fetch("/api/state");
  return response.json();
}

function render(state) {
  els.step.textContent = state.step;
  els.y.textContent = fmt(state.y);
  els.ga.textContent = Number(state.ga).toFixed(6);
  els.gb.textContent = Number(state.gb).toFixed(6);
  els.magnitude.textContent = Number(state.magnitude).toFixed(6);
  els.lastInstruction.textContent = state.instruction;

  if (state.sample) {
    els.sampleSummary.textContent =
      `mean ${fmt(state.sample.mean, 4)} | positive ${state.sample.positive}/${state.sample.count}`;
  }

  drawChart(state.history || []);
}

function setFocus(target) {
  document.querySelectorAll(".focused").forEach((node) => node.classList.remove("focused"));
  if (!target) {
    return;
  }
  if (target === "chart") {
    document.querySelector(".chart-panel")?.classList.add("focused");
    return;
  }
  document.querySelectorAll(`[data-focus="${target}"]`).forEach((node) => {
    node.classList.add("focused");
  });
}

function renderTutorial() {
  const lesson = lessons[tutorialIndex];
  els.tutorialTitle.textContent = lesson.title;
  els.tutorialBody.textContent = lesson.body;
  els.tutorialTask.textContent = lesson.task;
  els.tutorialProgress.textContent = `${tutorialIndex + 1} / ${lessons.length}`;
  els.tutorialPrev.disabled = tutorialIndex === 0;
  els.tutorialNext.disabled = tutorialIndex === lessons.length - 1;
  els.tutorialActions.replaceChildren();
  lesson.actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => runTutorialAction(action));
    els.tutorialActions.appendChild(button);
  });
  setFocus(lesson.focus);
}

async function runTutorialAction(action) {
  let state;
  if (action.type === "preset") {
    state = await post("/api/preset", { name: action.name });
    els.sampleSummary.textContent = "";
  } else if (action.type === "evaluate") {
    state = await post("/api/evaluate", { instruction: action.instruction, noise: 0 });
  } else if (action.type === "cycle") {
    state = await post("/api/cycle", {
      read: action.read,
      feedback: action.feedback,
      count: action.count,
      noise: 0,
    });
  } else if (action.type === "sample") {
    state = await post("/api/sample", {
      instruction: action.instruction,
      count: action.count,
      noise: 0,
    });
  }
  if (state) {
    render(state);
  }
}

function drawChart(history) {
  const canvas = els.chart;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pad = 42;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#14191d";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#354048";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 4; i += 1) {
    const y = pad + ((h - pad * 2) * i) / 4;
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#9baaa4";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillText("+1", 10, pad + 4);
  ctx.fillText("0", 18, h / 2 + 4);
  ctx.fillText("-1", 13, h - pad + 4);

  if (history.length < 2) {
    return;
  }

  const maxMagnitude = Math.max(...history.map((point) => point.magnitude), 0.001);

  plotLine(ctx, history, (point) => point.y, "#41d198", (value) => {
    return pad + ((1 - value) / 2) * (h - pad * 2);
  });

  plotLine(ctx, history, (point) => point.magnitude, "#e0ad4f", (value) => {
    return h - pad - (value / maxMagnitude) * (h - pad * 2);
  });

  function plotLine(context, points, accessor, color, yScale) {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      const x = pad + (index / Math.max(points.length - 1, 1)) * (w - pad * 2);
      const y = yScale(accessor(point));
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  }
}

function wireInstructions() {
  instructions.forEach((instruction) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = instruction;
    button.className = readInstructions.has(instruction) ? "read" : "feedback";
    button.addEventListener("click", async () => {
      const state = await post("/api/evaluate", {
        instruction,
        noise: Number(els.noise.value),
      });
      render(state);
    });
    els.instructions.appendChild(button);
  });
}

els.reset.addEventListener("click", async () => {
  els.sampleSummary.textContent = "";
  const state = await post("/api/reset", {
    model: els.model.value,
    init: els.init.value,
    seed: Number(els.seed.value),
    read_noise: Number(els.readNoise.value),
    start_y: els.startY.value,
  });
  render(state);
});

els.runCycle.addEventListener("click", async () => {
  const state = await post("/api/cycle", {
    read: els.cycleRead.value,
    feedback: els.cycleFeedback.value,
    count: Number(els.cycleCount.value),
    noise: Number(els.noise.value),
  });
  render(state);
});

els.sample.addEventListener("click", async () => {
  const state = await post("/api/sample", {
    instruction: "FFLV",
    count: Number(els.sampleCount.value),
    noise: Number(els.noise.value),
  });
  render(state);
});

els.tutorialToggle.addEventListener("click", () => {
  els.tutorialPanel.hidden = !els.tutorialPanel.hidden;
  if (!els.tutorialPanel.hidden) {
    renderTutorial();
  } else {
    setFocus(null);
  }
});

els.tutorialPrev.addEventListener("click", () => {
  tutorialIndex = Math.max(0, tutorialIndex - 1);
  renderTutorial();
});

els.tutorialNext.addEventListener("click", () => {
  tutorialIndex = Math.min(lessons.length - 1, tutorialIndex + 1);
  renderTutorial();
});

els.tutorialRestart.addEventListener("click", async () => {
  const preset = lessons[tutorialIndex].actions.find((action) => action.type === "preset");
  if (preset) {
    await runTutorialAction(preset);
  }
  renderTutorial();
});

els.tutorialExit.addEventListener("click", () => {
  els.tutorialPanel.hidden = true;
  setFocus(null);
});

wireInstructions();
getState().then(render);
