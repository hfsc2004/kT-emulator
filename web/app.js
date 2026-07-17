// UI wrapper for Knowm Inc.'s ktram-neural-core emulator.
// ktram-neural-core package metadata labels the emulator software as MIT licensed.
// That license does not grant rights to Knowm hardware, devices, patents, or methods.

const instructions = ["FF", "FFLV", "RF", "RFLV", "FH", "FL", "FU", "FA", "FZ", "RH", "RL", "RU", "RA", "RZ"];
const readInstructions = new Set(["FF", "FFLV", "RF", "RFLV"]);
const tourSteps = [
  {
    selector: "#branch",
    title: "AAT Indicator",
    body: "AAT is the active address selection. This is a read-only status label; the first interface stays on AAT (0,), so every action targets the same visible synapse.",
  },
  {
    selector: "#tutorial-toggle",
    title: "Tutorial Button",
    body: "This opens or hides the lesson panel. Lessons teach concepts with short explanations and controlled emulator actions.",
  },
  {
    selector: "#tour-start",
    title: "Interface Tour Button",
    body: "This starts the guided bubble tour. Use it when you want to know what each window and control does.",
  },
  {
    selector: "#step",
    title: "Step Counter",
    body: "This read-only number increases as the emulator runs instructions, cycles, and resets. It helps you see that the state has advanced.",
  },
  {
    selector: ".metrics",
    title: "Read-Only State Window",
    body: "These four cards are measurements, not inputs. They summarize the selected synapse right now: activation, the two conductances, and total magnitude.",
  },
  {
    selector: "#y",
    title: "Activation y",
    body: "Activation is a read-only result. Positive means the selected synapse leans one way, negative means it leans the other way, and zero means balanced.",
  },
  {
    selector: "#ga",
    title: "Ga Conductance",
    body: "Ga is a read-only conductance measurement for one side of the differential pair. The emulator compares Ga and Gb to produce activation y.",
  },
  {
    selector: "#gb",
    title: "Gb Conductance",
    body: "Gb is the read-only conductance measurement for the other side of the pair. When Ga and Gb are equal, activation stays near zero.",
  },
  {
    selector: "#magnitude",
    title: "Magnitude",
    body: "Magnitude is a read-only total stored conductance. Higher magnitude means more stored evidence and usually slower movement after feedback.",
  },
  {
    selector: "[data-focus='balance']",
    title: "Conductance Balance Window",
    body: "This window turns Ga and Gb into paired bars so the balance is visible without reading the numbers alone.",
  },
  {
    selector: "[data-focus='gauge']",
    title: "Weight Gauge Window",
    body: "This gauge maps activation onto a -1 to +1 scale. The center is balanced, the right side is positive, and the left side is negative.",
  },
  {
    selector: "[data-focus='samples']",
    title: "Noisy Read Samples Window",
    body: "This window shows how many low-voltage reads landed positive or negative during sampling.",
  },
  {
    selector: ".tutorial-panel",
    title: "Tutorial Lesson Window",
    body: "This panel holds the concept lesson, task, action buttons, completion status, and lesson navigation.",
    showTutorial: true,
  },
  {
    selector: "#tutorial-prev",
    title: "Tutorial Back Button",
    body: "Back moves to the previous lesson step without resetting the emulator state.",
    showTutorial: true,
  },
  {
    selector: "#tutorial-next",
    title: "Tutorial Next Button",
    body: "Next moves to the next lesson step. Some steps also have action checks that confirm you ran the intended operation.",
    showTutorial: true,
  },
  {
    selector: "#tutorial-reset-lesson",
    title: "Reset Lesson Button",
    body: "Reset Lesson returns the current lesson to its expected starting state, usually by loading the lesson preset.",
    showTutorial: true,
  },
  {
    selector: "#tutorial-restart",
    title: "Tutorial Restart Button",
    body: "Restart sends the lesson flow back to the first tutorial step and clears the lesson completion checks.",
    showTutorial: true,
  },
  {
    selector: "#tutorial-exit",
    title: "Tutorial Exit Button",
    body: "Exit hides the lesson panel and leaves the main emulator dashboard available for free exploration.",
    showTutorial: true,
  },
  {
    selector: ".controls",
    title: "Adjustable Control Window",
    body: "This left panel is the main place where you can change things: reset the core, run instructions, run cycles, and collect noisy samples.",
  },
  {
    selector: "#model",
    title: "Model Selector",
    body: "Model chooses the emulator representation. Start with float while learning because it is the easiest to interpret.",
  },
  {
    selector: "#init",
    title: "Init Selector",
    body: "Init chooses the starting conductance pattern used when you reset the core.",
  },
  {
    selector: "#seed",
    title: "Seed Input",
    body: "Seed controls repeatable random initialization. The same seed and settings should start the emulator the same way.",
  },
  {
    selector: "#start-y",
    title: "Start y Input",
    body: "Start y can request a starting activation between -1 and +1. Leave it blank when you want the selected init preset to decide.",
  },
  {
    selector: "#read-noise",
    title: "Read Noise Slider",
    body: "Read noise sets the core noise used after reset. Higher values make low-voltage reads vary more.",
  },
  {
    selector: "#reset",
    title: "Reset Core Button",
    body: "Reset core rebuilds the emulator with the selected model, init, seed, read noise, and optional starting activation.",
  },
  {
    selector: "#instructions",
    title: "Instruction Button Grid",
    body: "These are the Chapter 4b emulator instruction buttons exposed by ktram-neural-core. Blue buttons are reads; amber buttons are feedback/update instructions.",
  },
  {
    selector: "[data-instruction='FF']",
    title: "FF Instruction",
    body: "FF is a forward read. The core computes Vy from the selected devices and stores the resulting activation y.",
  },
  {
    selector: "[data-instruction='FFLV']",
    title: "FFLV Instruction",
    body: "FFLV is a forward low-voltage read. In the Chapter 4b emulator, low voltage means the read uses the sub-threshold V_app path.",
  },
  {
    selector: "[data-instruction='RF']",
    title: "RF Instruction",
    body: "RF is a reverse read. Like FF, it computes Vy from the devices and updates the retained activation y, but with reverse direction.",
  },
  {
    selector: "[data-instruction='RFLV']",
    title: "RFLV Instruction",
    body: "RFLV is a reverse low-voltage read. It combines reverse direction with the sub-threshold V_app path.",
  },
  {
    selector: "[data-instruction='FH']",
    title: "FH Instruction",
    body: "FH is forward feedback with coefficient -1. It forces Vy from the feedback rule instead of computing y from a read.",
  },
  {
    selector: "[data-instruction='FL']",
    title: "FL Instruction",
    body: "FL is forward feedback with coefficient +1. Feedback updates conductance while leaving the retained y from the last read unchanged.",
  },
  {
    selector: "[data-instruction='FU']",
    title: "FU Instruction",
    body: "FU is forward feedback with coefficient +1 multiplied by H(y), where H(y) is +1 when y is nonnegative and -1 when y is negative.",
  },
  {
    selector: "[data-instruction='FA']",
    title: "FA Instruction",
    body: "FA is forward feedback with coefficient -1 multiplied by H(y). It depends on the sign of the retained activation y.",
  },
  {
    selector: "[data-instruction='FZ']",
    title: "FZ Instruction",
    body: "FZ is forward feedback with coefficient 0. It still runs through the update path with the forward applied voltage.",
  },
  {
    selector: "[data-instruction='RH']",
    title: "RH Instruction",
    body: "RH is reverse feedback with coefficient +1. The first training lesson pairs FF then RH to demonstrate a positive-moving feedback cycle.",
  },
  {
    selector: "[data-instruction='RL']",
    title: "RL Instruction",
    body: "RL is reverse feedback with coefficient -1. Compare it with RH to see how coefficient sign changes the update.",
  },
  {
    selector: "[data-instruction='RU']",
    title: "RU Instruction",
    body: "RU is reverse feedback with coefficient +1 multiplied by H(y), so it depends on whether the last retained y was positive or negative.",
  },
  {
    selector: "[data-instruction='RA']",
    title: "RA Instruction",
    body: "RA is reverse feedback with coefficient -1 multiplied by H(y). It is the reverse-direction H(y)-gated counterpart to FA.",
  },
  {
    selector: "[data-instruction='RZ']",
    title: "RZ Instruction",
    body: "RZ is reverse feedback with coefficient 0. It uses the reverse applied voltage while forcing the feedback coefficient to zero.",
  },
  {
    selector: "#cycle-read",
    title: "Cycle Read Selector",
    body: "This chooses the read instruction used at the start of each cycle.",
  },
  {
    selector: "#cycle-feedback",
    title: "Cycle Feedback Selector",
    body: "This chooses the feedback instruction paired with the cycle read.",
  },
  {
    selector: "#cycle-count",
    title: "Cycle Count Input",
    body: "Count controls how many read/feedback pairs run when you press Run cycle.",
  },
  {
    selector: "#run-cycle",
    title: "Run Cycle Button",
    body: "Run cycle repeats the selected read and feedback pair. This is the fastest way to watch feedback change memory over time.",
  },
  {
    selector: "#noise",
    title: "Sampling Noise Dial",
    body: "This noise dial is sent with free-exploration instruction, cycle, and sample actions. It lets you explore noisier behavior.",
  },
  {
    selector: "#sample-count",
    title: "Sample Count Input",
    body: "Samples controls how many low-voltage reads are collected when you press Sample FFLV.",
  },
  {
    selector: "#sample",
    title: "Sample FFLV Button",
    body: "Sample FFLV collects repeated low-voltage reads and updates the positive/negative sample window.",
  },
  {
    selector: ".chart-panel",
    title: "History Window",
    body: "This chart tracks activation y and magnitude as the emulator runs. It is the best place to see learning unfold over multiple steps.",
  },
  {
    selector: "#last-instruction",
    title: "Last Instruction",
    body: "This text shows the most recent reset, instruction, cycle, or sample action.",
  },
  {
    selector: "#sample-summary",
    title: "Sample Summary",
    body: "After sampling, this area shows the sample mean and how many reads landed positive.",
  },
  {
    selector: ".legend",
    title: "Chart Legend",
    body: "Green is activation y. Amber is magnitude. Reading both together helps separate direction from stored evidence.",
  },
];
const lessons = [
  {
    title: "What is this emulator?",
    body: "This is a software sandbox for one kT-RAM neural lane. For now, you are looking at one tiny memory element called a synapse.",
    task: "Start with a balanced synapse. The activation should sit near zero because the two conductances are equal.",
    focus: "activation",
    check: {
      pending: "Load the balanced preset to start from a neutral synapse.",
      complete: "Complete: balanced preset loaded. The synapse is ready to explore.",
    },
    actions: [{ label: "Load balanced preset", type: "preset", name: "balanced", check: "action-complete" }],
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
    check: {
      pending: "Load the balanced preset, then run FF once.",
      complete: "Complete: you read the selected synapse and saw its activation.",
    },
    actions: [
      { label: "Load balanced preset", type: "preset", name: "balanced" },
      { label: "Run FF", type: "evaluate", instruction: "FF", check: "action-complete" },
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
    check: {
      pending: "Reset to balanced, then run FF once.",
      complete: "Complete: you read the balance between Ga and Gb.",
    },
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Run FF", type: "evaluate", instruction: "FF", check: "action-complete" },
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
    check: {
      pending: "Reset to balanced, then run five FF/RH cycles.",
      complete: "Complete: feedback cycles ran and changed the history.",
    },
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Run 5 cycles", type: "cycle", read: "FF", feedback: "RH", count: 5, check: "action-complete" },
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
    check: {
      pending: "Reset to balanced, then sample FFLV forty times.",
      complete: "Complete: noisy samples collected. Compare the positive and negative counts.",
    },
    actions: [
      { label: "Reset balanced", type: "preset", name: "balanced" },
      { label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40, check: "action-complete" },
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
    check: {
      pending: "Load both magnitude presets to compare stored evidence.",
      complete: "Complete: you loaded both low and high magnitude states.",
    },
    actions: [
      { label: "Low magnitude", type: "preset", name: "low-magnitude", check: "collect-preset" },
      { label: "High magnitude", type: "preset", name: "high-magnitude", check: "collect-preset" },
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
let tourIndex = 0;
let activeTourTarget = null;
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
  tourStart: document.querySelector("#tour-start"),
  tourScrim: document.querySelector("#tour-scrim"),
  tourBubble: document.querySelector("#tour-bubble"),
  tourTitle: document.querySelector("#tour-title"),
  tourBody: document.querySelector("#tour-body"),
  tourProgress: document.querySelector("#tour-progress"),
  tourPrev: document.querySelector("#tour-prev"),
  tourNext: document.querySelector("#tour-next"),
  tourClose: document.querySelector("#tour-close"),
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

function clearTourHighlight() {
  if (activeTourTarget) {
    activeTourTarget.classList.remove("tour-target");
    activeTourTarget = null;
  }
}

function positionTourBubble(target) {
  const targetRect = target.getBoundingClientRect();
  const bubbleRect = els.tourBubble.getBoundingClientRect();
  const margin = 12;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - targetRect.bottom;
  const placeBelow = spaceBelow >= bubbleRect.height + margin || targetRect.top < bubbleRect.height + margin;
  const top = placeBelow
    ? targetRect.bottom + margin
    : targetRect.top - bubbleRect.height - margin;
  const centeredLeft = targetRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
  const left = clamp(centeredLeft, margin, viewportWidth - bubbleRect.width - margin);

  els.tourBubble.style.top = `${Math.max(margin, top)}px`;
  els.tourBubble.style.left = `${left}px`;
}

function renderTour() {
  const step = tourSteps[tourIndex];
  if (!step) {
    closeTour();
    return;
  }

  if (step.showTutorial && els.tutorialPanel.hidden) {
    els.tutorialPanel.hidden = false;
    renderTutorial();
  }

  const target = document.querySelector(step.selector);
  if (!target) {
    tourIndex = Math.min(tourIndex + 1, tourSteps.length - 1);
    renderTour();
    return;
  }

  clearTourHighlight();
  activeTourTarget = target;
  target.classList.add("tour-target");
  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  els.tourTitle.textContent = step.title;
  els.tourBody.textContent = step.body;
  els.tourProgress.textContent = `${tourIndex + 1} / ${tourSteps.length}`;
  els.tourPrev.disabled = tourIndex === 0;
  els.tourNext.textContent = tourIndex === tourSteps.length - 1 ? "Finish" : "Next";
  els.tourScrim.hidden = false;
  els.tourBubble.hidden = false;

  window.setTimeout(() => positionTourBubble(target), 220);
}

function startTour() {
  tourIndex = 0;
  renderTour();
}

function closeTour() {
  clearTourHighlight();
  els.tourScrim.hidden = true;
  els.tourBubble.hidden = true;
}

function moveTour(delta) {
  if (tourIndex === tourSteps.length - 1 && delta > 0) {
    closeTour();
    return;
  }
  tourIndex = clamp(tourIndex + delta, 0, tourSteps.length - 1);
  renderTour();
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
  if (action.check === "action-complete") {
    check.completed = true;
    renderTutorialStatus(lesson.check.complete, "complete");
    return;
  }

  if (action.check === "collect-preset") {
    if (!check.presets) {
      check.presets = new Set();
    }
    check.presets.add(action.name);
    const required = new Set((lesson.actions || [])
      .filter((lessonAction) => lessonAction.check === "collect-preset")
      .map((lessonAction) => lessonAction.name));
    check.completed = [...required].every((name) => check.presets.has(name));
    const message = check.completed
      ? lesson.check.complete
      : `Loaded ${check.presets.size}/${required.size} presets. Load the other magnitude preset to finish.`;
    renderTutorialStatus(message, check.completed ? "complete" : "pending");
    return;
  }

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
  ctx.fillStyle = "#101417";
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
    button.dataset.instruction = instruction;
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

els.tourStart.addEventListener("click", startTour);

els.tourPrev.addEventListener("click", () => moveTour(-1));

els.tourNext.addEventListener("click", () => moveTour(1));

els.tourClose.addEventListener("click", closeTour);

window.addEventListener("resize", () => {
  if (!els.tourBubble.hidden && activeTourTarget) {
    positionTourBubble(activeTourTarget);
  }
});

window.addEventListener("keydown", (event) => {
  if (els.tourBubble.hidden) {
    return;
  }
  if (event.key === "Escape") {
    closeTour();
  } else if (event.key === "ArrowRight") {
    moveTour(1);
  } else if (event.key === "ArrowLeft") {
    moveTour(-1);
  }
});

wireInstructions();
getState().then(render);
