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
    details: [
      {
        title: "Scenario",
        items: [
          "Before engineers test a new aircraft control idea on real hardware, they use a simulator.",
          "This emulator is the same kind of safe sandbox, but for one kT-RAM neural lane.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "You can try reads, feedback, noise, and presets without damaging a device or needing special hardware.",
          "Learning one lane first makes bigger kT-RAM systems easier to understand later.",
        ],
      },
    ],
  },
  {
    title: "How a regular computer works",
    body: "A conventional computer keeps most memory and processing separate. The CPU fetches instructions, reads data from memory, works on that data, then writes results back.",
    task: "Follow the example as a mental model. No emulator action is needed yet.",
    focus: null,
    details: [
      {
        title: "Scenario",
        items: [
          "A game stores your score in memory while the CPU runs the rules.",
          "When you collect a point, the CPU reads the score, adds one, and writes the new score back.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "This is the pattern most software follows: move data to the processor, change it, then store it again.",
          "kT-RAM is easier to compare once that normal pattern is clear.",
        ],
      },
      {
        title: "High level",
        items: [
          "Memory stores instructions and values.",
          "The CPU runs instructions one step at a time.",
          "A program usually moves data from memory to the CPU, changes it, then stores the result.",
        ],
      },
      {
        title: "Example",
        items: [
          "A program reads a score from memory.",
          "The CPU adds one point.",
          "The program writes the new score back to memory.",
        ],
      },
      {
        title: "Flow",
        flow: ["Memory", "CPU registers", "Arithmetic unit", "Memory"],
      },
      {
        title: "Low level",
        items: [
          "Bits encode the instruction, the address of the score, and the number one.",
          "Registers hold the score while the CPU arithmetic unit changes it.",
          "A branch can choose the next instruction when a condition is true or false.",
        ],
      },
    ],
  },
  {
    title: "How kT-RAM is different",
    body: "In kT-RAM, the stored state and the operation are tied closely together. Conductance stores the learned state, and read plus feedback instructions interact with that state.",
    task: "Load a balanced synapse, then run FF once. Compare the visible flow with the CPU example.",
    focus: "balance",
    actions: [
      { label: "Load balanced preset", type: "preset", name: "balanced" },
      { label: "Run FF", type: "evaluate", instruction: "FF" },
    ],
    details: [
      {
        title: "Scenario",
        items: [
          "Imagine a tiny spam filter learning whether one signal should count as more spam-like or less spam-like.",
          "Instead of storing a normal number, this lane stores its learned state in conductance.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "This shows why someone would use feedback: to make future reads lean toward what the system has learned.",
          "The emulator lets you see that stored state move instead of treating learning as a hidden black box.",
        ],
      },
      {
        title: "High level",
        items: [
          "A selected synapse stores state as two conductances: Ga and Gb.",
          "A read produces activation y from the balance between those conductances.",
          "Feedback can nudge the conductances, so the stored state changes.",
        ],
      },
      {
        title: "Same example",
        items: [
          "Instead of reading a score into a CPU register, the lane reads a selected synapse.",
          "The result is an activation: y leans negative, balanced, or positive.",
          "Feedback is like updating the stored evidence for the next read.",
        ],
      },
      {
        title: "Flow",
        flow: ["AAT (0,)", "Ga/Gb state", "Activation y", "Feedback-adjusted conductance"],
      },
      {
        title: "Low level",
        items: [
          "AAT selects which synapse address is active. This tutorial uses AAT (0,).",
          "The differential weight comes from Ga minus Gb, normalized into y.",
          "Read voltage, noise, and feedback instructions control how strongly the emulator samples or changes the state.",
        ],
      },
    ],
  },
  {
    title: "Where the analogy breaks",
    body: "The comparison is useful, but it is not exact. A software variable is not the same thing as conductance, and this app is an emulator of one small lane surface.",
    task: "Use the side-by-side bridge to keep the terms straight before changing memory with feedback.",
    focus: "activation",
    details: [
      {
        title: "Scenario",
        items: [
          "A map is useful, but it is not the same thing as the road.",
          "The computer comparison is a map: it helps you start, but it is not a perfect copy of kT-RAM behavior.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "The analogy prevents confusion between a software variable and a conductance state.",
          "Knowing where the analogy breaks keeps the lesson honest about what the emulator demonstrates.",
        ],
      },
      {
        title: "Vocabulary bridge",
        pairs: [
          ["Memory address", "AAT selects an address-like synapse location."],
          ["Stored value", "Ga and Gb hold conductance state, not a normal integer variable."],
          ["CPU result", "Activation y is the read result from the selected lane state."],
          ["Write back", "Feedback changes conductance instead of storing a copied value."],
        ],
      },
      {
        title: "Keep separate",
        items: [
          "Conventional computers usually separate storage and processing.",
          "kT-RAM makes memory behavior part of the computation being explored.",
          "The UI demonstrates the emulator model, not a complete physical hardware system.",
        ],
      },
      {
        title: "Two flows",
        flowGroups: [
          {
            label: "Conventional",
            steps: ["Memory", "CPU", "Memory"],
          },
          {
            label: "kT-RAM",
            steps: ["Selected synapse", "Activation", "Feedback"],
          },
        ],
      },
    ],
  },
  {
    title: "One synapse, two conductances",
    body: "The synapse is made from two sides: Ga and Gb. The activation y comes from their balance. If Ga and Gb match, y is near zero.",
    task: "Read the synapse once with FF. Watch the conductance bars and the y gauge.",
    focus: "balance",
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Run FF", type: "evaluate", instruction: "FF" },
    ],
    details: [
      {
        title: "Scenario",
        items: [
          "A thermostat compares two pressures: too cold and too hot.",
          "The decision comes from which side is stronger, not from either side alone.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "Ga and Gb work like two sides of a comparison.",
          "The activation y tells you which side is winning and by how much.",
        ],
      },
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
    details: [
      {
        title: "Scenario",
        items: [
          "A spam filter improves when you mark a message as spam.",
          "That feedback nudges future decisions so similar messages are more likely to be flagged.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "Running FF then RH is a tiny version of learning from feedback.",
          "You should see y move because the stored conductance state changed.",
        ],
      },
    ],
  },
  {
    title: "Project: teach a positive preference",
    body: "Now use feedback for a small useful job: store a tiny preference that makes this synapse lean positive.",
    task: "Reset, measure the starting activation, train with FF/RH cycles, then read again. The lesson is complete when y moves above its starting value.",
    focus: "chart",
    check: {
      pending: "Measure the starting y, train with feedback, then read again.",
      baselineMissing: "Measure the starting y first.",
      complete: "Complete: y moved positive after feedback. You changed memory with training.",
      incomplete: "Not complete yet: y has not moved positive from the starting read.",
    },
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced", resetCheck: true },
      { label: "Measure starting y", type: "evaluate", instruction: "FF", record: "baseline-y" },
      { label: "Train positive", type: "cycle", read: "FF", feedback: "RH", count: 8 },
      { label: "Read result", type: "evaluate", instruction: "FF", check: "positive-moved" },
    ],
    details: [
      {
        title: "Scenario",
        items: [
          "A simple filter may learn that one signal should usually count as yes.",
          "This lesson stores that tiny yes preference in one synapse by using feedback.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "This is the smallest useful learning loop in the tutorial: read, train, read again.",
          "If y moves positive, the feedback changed the stored conductance state.",
        ],
      },
      {
        title: "What to watch",
        items: [
          "The y gauge should move above its starting value.",
          "The conductance bars should separate as one side becomes stronger.",
          "The chart should show the training history instead of just a static value.",
        ],
      },
    ],
  },
  {
    title: "Noise can be useful",
    body: "Low-voltage reads can act like samples. Near y = 0, the sign of the read can flip around like a soft coin toss.",
    task: "Sample FFLV forty times. The positive count shows how often the noisy read landed above zero.",
    focus: "samples",
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40 },
    ],
    details: [
      {
        title: "Scenario",
        items: [
          "A recommendation system may try different options when it is unsure what you prefer.",
          "As evidence grows, the choices become less random and more biased toward what it has learned.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "Noisy samples show uncertainty instead of hiding it.",
          "The positive and negative counts help you see whether the lane is balanced or biased.",
        ],
      },
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
    details: [
      {
        title: "Scenario",
        items: [
          "One customer review is weak evidence. Hundreds of reviews are harder to overturn.",
          "A system should change quickly when evidence is small and more slowly when evidence is large.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "Magnitude helps explain how much stored evidence is behind the current weight.",
          "Two states can point the same direction but have different resistance to change.",
        ],
      },
    ],
  },
  {
    title: "Where this is heading",
    body: "Right now, this tutorial teaches the primitive behavior: reads, feedback, noise, conductance balance, and stored evidence.",
    task: "Use this as a roadmap. Logic gates, supervised classifiers, and auto-encoders build on the same lower-level ideas you just explored.",
    focus: "chart",
    details: [
      {
        title: "Current scope",
        items: [
          "One lane, one selected address, and one visible differential conductance pair.",
          "Enough surface area to learn how reading and feedback change stored state.",
        ],
      },
      {
        title: "Near roadmap",
        items: [
          "Logic gates can show how simple computation is assembled from lane behavior.",
          "Supervised classifiers can show how feedback trains decisions from examples.",
          "Auto-encoders can show how systems learn compressed internal representations.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "The current emulator is the foundation, not the finish line.",
          "If you understand one synapse changing after feedback, later gates and classifiers have a concrete place to start.",
        ],
      },
    ],
  },
];
let tutorialIndex = 0;
const tutorialChecks = new Map();

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
  gaBar: document.querySelector("#ga-bar"),
  gbBar: document.querySelector("#gb-bar"),
  balanceNote: document.querySelector("#balance-note"),
  weightFill: document.querySelector("#weight-fill"),
  weightNeedle: document.querySelector("#weight-needle"),
  weightNote: document.querySelector("#weight-note"),
  negativeBar: document.querySelector("#negative-bar"),
  positiveBar: document.querySelector("#positive-bar"),
  sampleNote: document.querySelector("#sample-note"),
  tutorialToggle: document.querySelector("#tutorial-toggle"),
  tutorialPanel: document.querySelector("#tutorial-panel"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialBody: document.querySelector("#tutorial-body"),
  tutorialTask: document.querySelector("#tutorial-task"),
  tutorialDetails: document.querySelector("#tutorial-details"),
  tutorialStatus: document.querySelector("#tutorial-status"),
  tutorialActions: document.querySelector("#tutorial-actions"),
  tutorialProgress: document.querySelector("#tutorial-progress"),
  tutorialPrev: document.querySelector("#tutorial-prev"),
  tutorialNext: document.querySelector("#tutorial-next"),
  tutorialResetLesson: document.querySelector("#tutorial-reset-lesson"),
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
    renderSamples(state.sample);
  }

  renderVisuals(state);
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderVisuals(state) {
  const ga = Number(state.ga);
  const gb = Number(state.gb);
  const y = clamp(Number(state.y), -1, 1);
  const maxG = Math.max(ga, gb, 0.000001);
  const gaPct = (ga / maxG) * 100;
  const gbPct = (gb / maxG) * 100;
  const needlePct = ((y + 1) / 2) * 100;
  const fillPct = Math.abs(y) * 50;

  els.gaBar.style.width = `${gaPct}%`;
  els.gbBar.style.width = `${gbPct}%`;
  els.weightNeedle.style.left = `${needlePct}%`;
  els.weightFill.style.left = y < 0 ? `${50 - fillPct}%` : "50%";
  els.weightFill.style.width = `${fillPct}%`;

  const stronger = Math.abs(ga - gb) < 1e-9 ? "balanced" : (ga > gb ? "Ga is larger" : "Gb is larger");
  els.balanceNote.textContent = `${stronger}. The gap between Ga and Gb sets the sign and size of y.`;
  els.weightNote.textContent = `y is ${fmt(y, 3)} on a scale from -1 to +1.`;
}

function renderSamples(sample) {
  const total = Math.max(sample.count, 1);
  const positive = sample.positive;
  const negative = total - positive;
  els.positiveBar.style.width = `${(positive / total) * 100}%`;
  els.negativeBar.style.width = `${(negative / total) * 100}%`;
  els.sampleNote.textContent = `${negative} negative and ${positive} positive samples out of ${total}.`;
}

function clearSamples() {
  els.positiveBar.style.width = "0";
  els.negativeBar.style.width = "0";
  els.sampleNote.textContent = "Run Sample FFLV to see the noisy read split.";
}

function renderTutorial() {
  const lesson = lessons[tutorialIndex];
  els.tutorialTitle.textContent = lesson.title;
  els.tutorialBody.textContent = lesson.body;
  els.tutorialTask.textContent = lesson.task;
  els.tutorialProgress.textContent = `${tutorialIndex + 1} / ${lessons.length}`;
  els.tutorialPrev.disabled = tutorialIndex === 0;
  els.tutorialNext.disabled = tutorialIndex === lessons.length - 1;
  renderTutorialDetails(lesson.details || []);
  renderTutorialStatus();
  els.tutorialActions.replaceChildren();
  (lesson.actions || []).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => runTutorialAction(action));
    els.tutorialActions.appendChild(button);
  });
  setFocus(lesson.focus);
}

function getTutorialCheck() {
  if (!tutorialChecks.has(tutorialIndex)) {
    tutorialChecks.set(tutorialIndex, {});
  }
  return tutorialChecks.get(tutorialIndex);
}

function renderTutorialStatus(message, kind) {
  const lesson = lessons[tutorialIndex];
  const check = getTutorialCheck();
  const text = message || (check.completed ? lesson.check?.complete : lesson.check?.pending);
  els.tutorialStatus.textContent = text || "";
  els.tutorialStatus.className = "tutorial-status";
  if (text) {
    els.tutorialStatus.classList.add(kind || (check.completed ? "complete" : "pending"));
  }
}

function resetTutorialCheck() {
  tutorialChecks.set(tutorialIndex, {});
  renderTutorialStatus();
}

async function resetLessonState() {
  resetTutorialCheck();
  const preset = (lessons[tutorialIndex].actions || []).find((action) => action.type === "preset");
  if (preset) {
    await runTutorialAction(preset);
  } else {
    els.sampleSummary.textContent = "";
    clearSamples();
  }
  renderTutorial();
}

async function restartTutorial() {
  tutorialChecks.clear();
  tutorialIndex = 0;
  await resetLessonState();
}

function renderTutorialDetails(details) {
  els.tutorialDetails.replaceChildren();
  details.forEach((section) => {
    const card = document.createElement("section");
    card.className = "tutorial-detail";

    const title = document.createElement("h3");
    title.textContent = section.title;
    card.appendChild(title);

    if (section.items) {
      const list = document.createElement("ul");
      section.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      card.appendChild(list);
    }

    if (section.pairs) {
      const dl = document.createElement("dl");
      section.pairs.forEach(([term, explanation]) => {
        const dt = document.createElement("dt");
        dt.textContent = term;
        const dd = document.createElement("dd");
        dd.textContent = explanation;
        dl.append(dt, dd);
      });
      card.appendChild(dl);
    }

    if (section.flow) {
      card.appendChild(renderFlow(section.flow));
    }

    if (section.flowGroups) {
      const groups = document.createElement("div");
      groups.className = "tutorial-flow-groups";
      section.flowGroups.forEach((group) => {
        const wrapper = document.createElement("div");
        wrapper.className = "tutorial-flow-group";
        const label = document.createElement("strong");
        label.textContent = group.label;
        wrapper.append(label, renderFlow(group.steps));
        groups.appendChild(wrapper);
      });
      card.appendChild(groups);
    }

    els.tutorialDetails.appendChild(card);
  });
}

function renderFlow(steps) {
  const flow = document.createElement("ol");
  flow.className = "tutorial-flow";
  steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    flow.appendChild(item);
  });
  return flow;
}

async function runTutorialAction(action) {
  let state;
  if (action.type === "preset") {
    state = await post("/api/preset", { name: action.name });
    els.sampleSummary.textContent = "";
    clearSamples();
    if (action.resetCheck) {
      resetTutorialCheck();
    }
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
    updateTutorialCheck(action, state);
  }
}

function updateTutorialCheck(action, state) {
  const lesson = lessons[tutorialIndex];
  if (!lesson.check || (!action.record && !action.check)) {
    return;
  }

  const check = getTutorialCheck();
  if (action.record === "baseline-y") {
    check.baselineY = Number(state.y);
    check.completed = false;
    renderTutorialStatus(`Starting y recorded: ${fmt(check.baselineY, 4)}. Now train positive.`, "pending");
    return;
  }

  if (action.check === "positive-moved") {
    if (typeof check.baselineY !== "number") {
      renderTutorialStatus(lesson.check.baselineMissing, "warning");
      return;
    }
    const delta = Number(state.y) - check.baselineY;
    check.completed = delta > 0.01;
    const message = check.completed
      ? `${lesson.check.complete} Change: ${fmt(delta, 4)}.`
      : `${lesson.check.incomplete} Change: ${fmt(delta, 4)}.`;
    renderTutorialStatus(message, check.completed ? "complete" : "warning");
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
  clearSamples();
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

els.tutorialResetLesson.addEventListener("click", resetLessonState);

els.tutorialRestart.addEventListener("click", restartTutorial);

els.tutorialExit.addEventListener("click", () => {
  els.tutorialPanel.hidden = true;
  setFocus(null);
});

wireInstructions();
getState().then(render);
