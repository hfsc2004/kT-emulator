// UI wrapper for Knowm Inc.'s ktram-neural-core emulator.
// ktram-neural-core package metadata labels the emulator software as MIT licensed.
// That license does not grant rights to Knowm hardware, devices, patents, or methods.

const instructions = ["FF", "FFLV", "RF", "RFLV", "FH", "FL", "FU", "FA", "FZ", "RH", "RL", "RU", "RA", "RZ"];
const readInstructions = new Set(["FF", "FFLV", "RF", "RFLV"]);
const tourSteps = [
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
  {
    selector: ".tutorial-panel",
    title: "Tutorial Lesson Window",
    body: "This panel holds the concept lesson, task, action buttons, completion status, and lesson navigation.",
  },
  {
    selector: "#tutorial-prev",
    title: "Tutorial Back Button",
    body: "Back moves to the previous lesson step without resetting the emulator state.",
  },
  {
    selector: "#tutorial-next",
    title: "Tutorial Next Button",
    body: "Next moves to the next lesson step. Some steps also have action checks that confirm you ran the intended operation.",
  },
  {
    selector: "#tutorial-reset-lesson",
    title: "Reset Lesson Button",
    body: "Reset Lesson returns the current lesson to its expected starting state, usually by loading the lesson preset.",
  },
  {
    selector: "#branch",
    title: "AAT Indicator",
    body: "AAT is the active address selection. This is a read-only status label; the first interface stays on AAT (0,), so every action targets the same visible synapse.",
  },
  {
    selector: "#step",
    title: "Step Counter",
    body: "This read-only number increases as the emulator runs instructions, cycles, and resets. It helps you see that the state has advanced.",
  },
  {
    selector: "#tour-start",
    title: "Interface Tour Button",
    body: "This starts the guided bubble tour. Use it when you want to know what each window and control does.",
  },
];
const tutorialLessonGroups = [
  {
    id: "lesson-1",
    menuLabel: "Lesson 1: Emulator sandbox",
    title: "What is this emulator?",
    source: "Knowm Index, Chapters 3b, 4, and 4b",
    steps: [
      {
        title: "A safe place to experiment",
        body: "This is a safe software sandbox for one kT-RAM neural lane. It lets you try the ideas before touching hardware or larger examples.",
        task: "Start by loading a balanced synapse. The top readings should show a neutral state.",
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
            title: "Source idea",
            items: [
              "Knowm's reader map frames the series as a thermodynamic neural processor built in the open.",
              "Chapter 4b narrows that story to an open Python emulator and one-synapse checks.",
            ],
          },
        ],
      },
      {
        title: "The normal computer pattern",
        body: "A conventional computer usually keeps memory and processing separate. It reads data from memory, works on it in the CPU, then writes a result back.",
        task: "Use this as the comparison point. No emulator action is needed on this step.",
        focus: null,
        details: [
          {
            title: "Example",
            flow: ["Memory", "CPU registers", "Arithmetic unit", "Memory"],
          },
          {
            title: "Why it matters",
            items: [
              "Most software moves data to the processor before it can change that data.",
              "kT-RAM is easier to understand once that normal separation is clear.",
            ],
          },
        ],
      },
      {
        title: "What changes in kT-RAM",
        body: "In kT-RAM, reading memory is already part of computing with it. The stored conductance state and the operation are tied together.",
        task: "Load a balanced synapse, then run FF once. Watch the activation update from the selected state.",
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
            title: "kT-RAM flow",
            flow: ["AAT (0,)", "Ga/Gb state", "Activation y", "Feedback can adjust conductance"],
          },
          {
            title: "Why it matters",
            items: [
              "The emulator lets you see stored state move instead of treating learning as a hidden black box.",
              "This app is an emulator model, not a full physical hardware simulator.",
            ],
          },
        ],
      },
      {
        title: "The words you need",
        body: "The tutorial uses a small vocabulary. Learn these words once and the rest of the controls become easier to read.",
        task: "Read the vocabulary bridge, then look for those words in the UI.",
        focus: "activation",
        details: [
          {
            title: "Vocabulary",
            pairs: [
              ["Lane", "One path through the emulator that reads selected synapses and produces activation."],
              ["Synapse", "The tiny stored state you are exploring in this first UI."],
              ["AAT", "The address selection. Here it stays at (0,), so one synapse is selected."],
              ["Read", "An instruction such as FF that measures the selected state and updates y."],
              ["Feedback", "An instruction such as RH or RL that nudges stored conductance."],
              ["Conductance", "Stored state shown as Ga and Gb."],
              ["Weight", "The visible lean that comes from comparing Ga and Gb."],
            ],
          },
        ],
      },
      {
        title: "Where the readings live",
        body: "The top state cards are measurements, not controls. They show what the selected synapse looks like right now.",
        task: "Find y, Ga, Gb, and magnitude in the top read-only cards.",
        focus: "activation",
        details: [
          {
            title: "Where to look",
            pairs: [
              ["y", "Activation card at the top. It is the read result."],
              ["Ga", "Top state card and the first conductance balance bar."],
              ["Gb", "Top state card and the second conductance balance bar."],
              ["Magnitude", "Top state card. It is Ga plus Gb, the amount of stored evidence."],
            ],
          },
          {
            title: "What you should see",
            items: [
              "Balanced presets should put y near zero.",
              "Ga and Gb should be close to each other.",
            ],
          },
        ],
      },
      {
        title: "Keep the analogy honest",
        body: "The computer comparison is useful, but it is only a map. A software variable is not the same thing as conductance.",
        task: "Use this bridge before moving into the conductance lesson.",
        focus: "activation",
        details: [
          {
            title: "Vocabulary bridge",
            pairs: [
              ["Memory address", "AAT selects an address-like synapse location."],
              ["Stored value", "Ga and Gb hold conductance state, not a normal integer variable."],
              ["CPU result", "Activation y is the read result from the selected lane state."],
              ["Write back", "Feedback changes conductance instead of storing a copied value."],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-2",
    menuLabel: "Lesson 2: Two conductances",
    title: "One synapse, two conductances",
    source: "Knowm Chapter 3b",
    steps: [
      {
        title: "A synapse has two sides",
        body: "Knowm's Chapter 3b builds a kT-bit from two memristors. In this app, those two sides are shown as Ga and Gb.",
        task: "Load the balanced preset and look at the Conductance Balance window.",
        focus: "balance",
        check: {
          pending: "Load the balanced preset to compare the two sides.",
          complete: "Complete: balanced preset loaded. Ga and Gb should be close.",
        },
        actions: [{ label: "Load balanced preset", type: "preset", name: "balanced", check: "action-complete" }],
        details: [
          {
            title: "Scenario",
            items: [
              "A thermostat compares too-cold and too-hot signals before deciding which way to lean.",
              "Ga and Gb are also two sides of a comparison.",
            ],
          },
        ],
      },
      {
        title: "Balance creates activation",
        body: "A read reports the balance between the two conductances as activation y. If the sides match, y sits near zero.",
        task: "Run FF once. Watch y and the Weight Gauge.",
        focus: "gauge",
        check: {
          pending: "Run FF once to read the balanced pair.",
          complete: "Complete: FF read the pair and updated y.",
        },
        actions: [{ label: "Run FF", type: "evaluate", instruction: "FF", check: "action-complete" }],
        details: [
          {
            title: "What to watch",
            items: [
              "The y value should stay near zero when Ga and Gb are similar.",
              "The gauge needle should stay near the center.",
            ],
          },
        ],
      },
      {
        title: "Bias the pair positive",
        body: "A positive preset starts with one side stronger. The app uses this to make the weight lean positive without asking you to tune conductances by hand.",
        task: "Load the positive preset and compare the bars.",
        focus: "balance",
        check: {
          pending: "Load the positive preset.",
          complete: "Complete: positive preset loaded. The pair is no longer balanced.",
        },
        actions: [{ label: "Load positive preset", type: "preset", name: "positive", check: "action-complete" }],
        details: [
          {
            title: "What you should see",
            items: [
              "The Weight Gauge should lean right.",
              "The conductance bars should no longer match exactly.",
            ],
          },
        ],
      },
      {
        title: "Bias the pair negative",
        body: "A negative preset leans the opposite direction. This makes the conductance balance feel like a comparison rather than a single stored number.",
        task: "Load the negative preset and compare it with the previous positive state.",
        focus: "gauge",
        check: {
          pending: "Load the negative preset.",
          complete: "Complete: negative preset loaded. The gauge should lean the other way.",
        },
        actions: [{ label: "Load negative preset", type: "preset", name: "negative", check: "action-complete" }],
        details: [
          {
            title: "Why it matters",
            items: [
              "The visible weight comes from the relationship between Ga and Gb.",
              "The pair carries more information than one ordinary scalar weight.",
            ],
          },
        ],
      },
      {
        title: "Lesson check",
        body: "You have now seen balanced, positive, and negative states. The same two readings, Ga and Gb, explain all three.",
        task: "Reset balanced when you are ready for the read-instruction lesson.",
        focus: "balance",
        actions: [{ label: "Reset balanced", type: "preset", name: "balanced" }],
        details: [
          {
            title: "Summary",
            items: [
              "Ga and Gb are the two conductance sides.",
              "y is the normalized read result from their balance.",
              "The bars and gauge are read-only views of that state.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-3",
    menuLabel: "Lesson 3: Reads and low voltage",
    title: "Reading without changing much",
    source: "Knowm Chapters 3b and 4b",
    steps: [
      {
        title: "A read reports y",
        body: "Read instructions compute activation y from the selected conductance pair. In this UI, the basic read is FF.",
        task: "Load balanced, then run FF.",
        focus: "activation",
        check: {
          pending: "Load balanced, then run FF once.",
          complete: "Complete: FF read the selected synapse.",
        },
        actions: [
          { label: "Load balanced", type: "preset", name: "balanced" },
          { label: "Run FF", type: "evaluate", instruction: "FF", check: "action-complete" },
        ],
        details: [
          {
            title: "Read instructions",
            items: [
              "FF and RF are standard reads.",
              "FFLV and RFLV are low-voltage reads.",
            ],
          },
        ],
      },
      {
        title: "Low voltage reads",
        body: "Chapter 3b treats low-voltage reading as a way to sample the state. Lower read voltage makes noisy samples more visible.",
        task: "Run FFLV once and compare it with the last FF read.",
        focus: "activation",
        check: {
          pending: "Run FFLV once.",
          complete: "Complete: FFLV read the state through the low-voltage path.",
        },
        actions: [{ label: "Run FFLV", type: "evaluate", instruction: "FFLV", check: "action-complete" }],
        details: [
          {
            title: "What to notice",
            items: [
              "A single low-voltage read may not look dramatic.",
              "The difference becomes clearer when you collect many samples.",
            ],
          },
        ],
      },
      {
        title: "Sample a balanced pair",
        body: "Near y = 0, noisy low-voltage reads can land on either side. The split shows uncertainty instead of hiding it.",
        task: "Sample FFLV forty times from a balanced state.",
        focus: "samples",
        check: {
          pending: "Reset balanced, then sample FFLV forty times.",
          complete: "Complete: balanced samples collected. Compare positive and negative counts.",
        },
        actions: [
          { label: "Reset balanced", type: "preset", name: "balanced" },
          { label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40, check: "action-complete" },
        ],
        details: [
          {
            title: "What you should see",
            items: [
              "The positive and negative bars should both have activity.",
              "A balanced state should feel coin-like, not locked to one answer.",
            ],
          },
        ],
      },
      {
        title: "Read gently, then decide later",
        body: "The point of a read is to observe the current state. The point of feedback is to change it. Keeping those ideas separate makes the instruction grid less mysterious.",
        task: "Use this step as a vocabulary check before feedback changes memory.",
        focus: "instructions",
        details: [
          {
            title: "Bridge",
            pairs: [
              ["Read", "Reports y from the selected state."],
              ["Low-voltage read", "Samples the state with more visible randomness."],
              ["Feedback", "Changes conductance instead of only reporting y."],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-4",
    menuLabel: "Lesson 4: Feedback changes memory",
    title: "Feedback changes memory",
    source: "Knowm Chapters 3b and 4b",
    steps: [
      {
        title: "Feedback is the nudge",
        body: "A read observes the synapse. Feedback nudges the stored conductances. This is the smallest learning loop in the emulator.",
        task: "Reset balanced so the next feedback action starts from a clear state.",
        focus: "chart",
        actions: [{ label: "Reset balanced", type: "preset", name: "balanced" }],
        details: [
          {
            title: "Scenario",
            items: [
              "A spam filter improves when you mark a message as spam.",
              "That feedback nudges future decisions so similar signals are more likely to be flagged.",
            ],
          },
        ],
      },
      {
        title: "Read, then reinforce",
        body: "The tutorial uses FF followed by RH as a simple positive-moving cycle. You read the state, then apply feedback.",
        task: "Run five FF/RH cycles and watch the chart.",
        focus: "chart",
        check: {
          pending: "Run five FF/RH cycles.",
          complete: "Complete: feedback cycles ran and changed the history.",
        },
        actions: [{ label: "Run 5 cycles", type: "cycle", read: "FF", feedback: "RH", count: 5, check: "action-complete" }],
        details: [
          {
            title: "What to watch",
            items: [
              "The history chart should gain several points.",
              "The y value should move because stored conductance changed.",
            ],
          },
        ],
      },
      {
        title: "Compare feedback directions",
        body: "RH and RL are both reverse feedback instructions, but their coefficient signs differ. That means they nudge the update differently.",
        task: "Predict which way RL will move compared with RH. Then run RL cycles from a balanced state.",
        focus: "chart",
        check: {
          pending: "Reset balanced, then run five FF/RL cycles.",
          complete: "Complete: FF/RL cycles ran. Compare the chart with FF/RH.",
        },
        actions: [
          { label: "Reset balanced", type: "preset", name: "balanced" },
          { label: "Run 5 FF/RL cycles", type: "cycle", read: "FF", feedback: "RL", count: 5, check: "action-complete" },
        ],
        details: [
          {
            title: "Why it matters",
            items: [
              "Feedback is not just a button named learning.",
              "The instruction choice changes how conductance is nudged.",
            ],
          },
        ],
      },
      {
        title: "Project setup",
        checkKey: "lesson-4-project",
        body: "Now use feedback for a small useful job: teach one synapse to lean positive.",
        task: "Reset balanced and measure the starting y.",
        focus: "activation",
        check: {
          pending: "Reset, then measure starting y.",
          complete: "Starting y recorded. Now train positive.",
        },
        actions: [
          { label: "Reset balanced", type: "preset", name: "balanced", resetCheck: true },
          { label: "Measure starting y", type: "evaluate", instruction: "FF", record: "baseline-y" },
        ],
        details: [
          {
            title: "Success condition",
            items: [
              "After training, y should be greater than this starting value.",
              "That shows feedback changed memory, not just the display.",
            ],
          },
        ],
      },
      {
        title: "Train the preference",
        checkKey: "lesson-4-project",
        body: "Repeated FF/RH cycles store a tiny yes preference in the selected synapse.",
        task: "Train positive, then read the result. The lesson is complete when y moves above the starting value.",
        focus: "chart",
        check: {
          pending: "Train with feedback, then read the result.",
          baselineMissing: "Measure the starting y first.",
          complete: "Complete: y moved positive after feedback. You changed memory with training.",
          incomplete: "Not complete yet: y has not moved positive from the starting read.",
        },
        actions: [
          { label: "Train positive", type: "cycle", read: "FF", feedback: "RH", count: 8 },
          { label: "Read result", type: "evaluate", instruction: "FF", check: "positive-moved" },
        ],
        details: [
          {
            title: "What to watch",
            items: [
              "The y gauge should move above its starting value.",
              "The conductance bars should separate as one side becomes stronger.",
              "The chart should show the training history.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-5",
    menuLabel: "Lesson 5: Magnitude",
    title: "Magnitude as confidence and inertia",
    source: "Knowm Chapter 3b",
    steps: [
      {
        title: "Magnitude is the total",
        body: "Magnitude is Ga plus Gb. Chapter 3b treats it as the common mode: the amount of stored evidence behind the current lean.",
        task: "Load the low-magnitude preset and look at the Magnitude card.",
        focus: "magnitude",
        check: {
          pending: "Load the low-magnitude preset.",
          complete: "Complete: low-magnitude state loaded.",
        },
        actions: [{ label: "Low magnitude", type: "preset", name: "low-magnitude", check: "collect-preset" }],
        details: [
          {
            title: "Scenario",
            items: [
              "One customer review is weak evidence.",
              "A few votes can be overturned easily.",
            ],
          },
        ],
      },
      {
        title: "Same lean, more evidence",
        body: "Two states can point the same direction but carry different amounts of evidence. That is what the magnitude presets demonstrate.",
        task: "Load the high-magnitude preset. Compare y and magnitude with the previous state.",
        focus: "magnitude",
        check: {
          pending: "Load both magnitude presets to compare stored evidence.",
          complete: "Complete: you loaded both low and high magnitude states.",
        },
        actions: [{ label: "High magnitude", type: "preset", name: "high-magnitude", check: "collect-preset" }],
        details: [
          {
            title: "What you should see",
            items: [
              "The starting y should be similar.",
              "The magnitude value should be much larger in the high-magnitude state.",
            ],
          },
        ],
      },
      {
        title: "Magnitude is inertia",
        body: "A larger magnitude is harder to move. The same feedback has a smaller effect when more evidence is already stored.",
        task: "Run five FF/RH cycles from the current high-magnitude state and watch how slowly y moves.",
        focus: "chart",
        check: {
          pending: "Run five FF/RH cycles from the high-magnitude state.",
          complete: "Complete: high-magnitude feedback cycles ran.",
        },
        actions: [{ label: "Run 5 cycles", type: "cycle", read: "FF", feedback: "RH", count: 5, check: "action-complete" }],
        details: [
          {
            title: "Why it matters",
            items: [
              "Magnitude acts like confidence and inertia at the same time.",
              "A synapse with more stored evidence should change more slowly.",
            ],
          },
        ],
      },
      {
        title: "Evidence in plain language",
        body: "Think of Ga and Gb as two running tallies. y is the lean of the vote. Magnitude is how many votes are behind it.",
        task: "Use the cards to say which number is the lean and which number is evidence.",
        focus: "magnitude",
        details: [
          {
            title: "Bridge",
            pairs: [
              ["Lean", "Activation y."],
              ["Positive tally", "Ga."],
              ["Negative tally", "Gb."],
              ["Evidence count", "Magnitude, or Ga plus Gb."],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-6",
    menuLabel: "Lesson 6: Noise and sampling",
    title: "Noise and sampling",
    source: "Knowm Chapter 3b",
    steps: [
      {
        title: "Noise is not only error",
        body: "Near a balanced state, noisy reads reveal uncertainty. That randomness can be useful because it tells you the lane is not strongly committed.",
        task: "Reset balanced before sampling.",
        focus: "samples",
        actions: [{ label: "Reset balanced", type: "preset", name: "balanced" }],
        details: [
          {
            title: "Scenario",
            items: [
              "A recommendation system may try different options when it is unsure.",
              "As evidence grows, choices become less random and more biased.",
            ],
          },
        ],
      },
      {
        title: "Balanced sampling",
        body: "When y is near zero, FFLV samples can split between positive and negative like a soft coin toss.",
        task: "Sample FFLV forty times.",
        focus: "samples",
        check: {
          pending: "Sample FFLV forty times from the balanced state.",
          complete: "Complete: balanced noisy samples collected.",
        },
        actions: [{ label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40, check: "action-complete" }],
        details: [
          {
            title: "What to watch",
            items: [
              "The sample bars show positive and negative counts.",
              "Balanced does not mean every sample is exactly zero.",
            ],
          },
        ],
      },
      {
        title: "Biased sampling",
        body: "If the weight leans positive, noisy samples should land positive more often. The randomness is still there, but the split changes.",
        task: "Load the positive preset, then sample FFLV forty times.",
        focus: "samples",
        check: {
          pending: "Load positive, then sample FFLV forty times.",
          complete: "Complete: biased noisy samples collected.",
        },
        actions: [
          { label: "Load positive preset", type: "preset", name: "positive" },
          { label: "Sample FFLV", type: "sample", instruction: "FFLV", count: 40, check: "action-complete" },
        ],
        details: [
          {
            title: "What should change",
            items: [
              "The positive bar should usually take a larger share.",
              "A stronger lean should bias the sample split.",
            ],
          },
        ],
      },
      {
        title: "The idea without calculus",
        body: "The probability of a positive sample rises when the weight is larger compared with the noise. You do not need the formula yet; just watch the split.",
        task: "Compare balanced samples with positive samples.",
        focus: "samples",
        details: [
          {
            title: "Plain language",
            pairs: [
              ["More balance", "More coin-like samples."],
              ["More lean", "More samples land on the leaning side."],
              ["More noise", "Samples spread out more."],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lesson-7",
    menuLabel: "Lesson 7: Bigger systems",
    title: "From one synapse to bigger systems",
    source: "Knowm Chapters 1, 4, and 4b",
    steps: [
      {
        title: "Current scope",
        body: "Right now, this app teaches primitive lane behavior: reads, feedback, noise, conductance balance, and stored evidence.",
        task: "Review the one-synapse scope before looking ahead.",
        focus: "chart",
        details: [
          {
            title: "What this app shows",
            items: [
              "One lane.",
              "One selected address.",
              "One visible differential conductance pair.",
            ],
          },
        ],
      },
      {
        title: "AAT scales the selection",
        body: "Chapter 4 describes the Activation Address Tuple as the selection pattern for a neural lane. This app fixes it at (0,), but larger examples can select more structure.",
        task: "Look at the AAT label in the top bar and connect it to the selected synapse.",
        focus: "activation",
        details: [
          {
            title: "Bridge",
            items: [
              "Here, AAT (0,) means one selected address.",
              "In larger lane examples, address selections become part of the computation.",
            ],
          },
        ],
      },
      {
        title: "From primitives to examples",
        body: "Logic gates, classifiers, and auto-encoders should come after the emulator exposes runnable examples for them.",
        task: "Use this as a roadmap, not as a claim that those examples are implemented here yet.",
        focus: "chart",
        details: [
          {
            title: "Near roadmap",
            items: [
              "Logic gates can show how simple computation is assembled from lane behavior.",
              "Supervised classifiers can show how feedback trains decisions from examples.",
              "Auto-encoders can show learned internal representations.",
            ],
          },
        ],
      },
      {
        title: "What to remember",
        body: "If you understand one synapse changing after feedback, later systems have a concrete place to start.",
        task: "Exit the tutorial or jump back to any lesson for review.",
        focus: "chart",
        details: [
          {
            title: "Summary",
            items: [
              "Reads report state.",
              "Feedback changes state.",
              "Magnitude is stored evidence.",
              "Noise can become sampling.",
              "A lane combines selected synapses into useful computation.",
            ],
          },
        ],
      },
    ],
  },
];
const lessons = tutorialLessonGroups.flatMap((group, groupIndex) => {
  return group.steps.map((step, stepIndex) => ({
    ...step,
    lessonId: group.id,
    lessonTitle: group.title,
    lessonMenuLabel: group.menuLabel,
    lessonSource: group.source,
    lessonNumber: groupIndex + 1,
    lessonCount: tutorialLessonGroups.length,
    lessonStep: stepIndex + 1,
    lessonStepCount: group.steps.length,
    menuLabel: `${group.menuLabel}: ${step.title}`,
  }));
});
const lessonStartIndexes = tutorialLessonGroups.map((group) => {
  return lessons.findIndex((lesson) => lesson.lessonId === group.id);
});
let tutorialIndex = 0;
let tutorialPage = 0;
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
  tutorialKicker: document.querySelector("#tutorial-kicker"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialBody: document.querySelector("#tutorial-body"),
  tutorialTask: document.querySelector("#tutorial-task"),
  tutorialDetails: document.querySelector("#tutorial-details"),
  tutorialStatus: document.querySelector("#tutorial-status"),
  tutorialActions: document.querySelector("#tutorial-actions"),
  tutorialJump: document.querySelector("#tutorial-jump"),
  tutorialProgress: document.querySelector("#tutorial-progress"),
  tutorialPrev: document.querySelector("#tutorial-prev"),
  tutorialNext: document.querySelector("#tutorial-next"),
  tutorialResetLesson: document.querySelector("#tutorial-reset-lesson"),
  tutorialExit: document.querySelector("#tutorial-exit"),
  tourStart: document.querySelector("#tour-start"),
  tourScrim: document.querySelector("#tour-scrim"),
  tourBubble: document.querySelector("#tour-bubble"),
  tourControls: document.querySelector("#tour-controls"),
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

function showTutorialPanel() {
  els.tutorialPanel.hidden = false;
  renderTutorial();
}

function hideTutorialPanel() {
  els.tutorialPanel.hidden = true;
  setFocus(null);
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
  if (target === "instructions") {
    document.querySelector("#instructions")?.classList.add("focused");
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

  if (step.selector === ".tutorial-panel" || document.querySelector(step.selector)?.closest("#tutorial-panel")) {
    showTutorialPanel();
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
  els.tourControls.hidden = false;

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
  els.tourControls.hidden = true;
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
  const pageCount = getTutorialPageCount(lesson);
  tutorialPage = clamp(tutorialPage, 0, pageCount - 1);
  const lessonStartIndex = lessonStartIndexes[lesson.lessonNumber - 1] ?? tutorialIndex;
  els.tutorialJump.value = String(lessonStartIndex);
  els.tutorialKicker.textContent = `Lesson ${lesson.lessonNumber} of ${lesson.lessonCount} | ${lesson.lessonTitle}`;
  els.tutorialTitle.textContent = lesson.title;
  els.tutorialBody.textContent = lesson.body;
  els.tutorialTask.textContent = lesson.task;
  els.tutorialProgress.textContent = `Step ${lesson.lessonStep} / ${lesson.lessonStepCount} | Page ${tutorialPage + 1} / ${pageCount}`;
  els.tutorialPrev.disabled = tutorialIndex === 0 && tutorialPage === 0;
  els.tutorialNext.disabled = tutorialIndex === lessons.length - 1 && tutorialPage === pageCount - 1;
  const hasMoreText = tutorialPage < pageCount - 1;
  els.tutorialNext.textContent = "Next >>";
  els.tutorialNext.classList.toggle("has-more", hasMoreText);
  renderTutorialDetails(getTutorialPageDetails(lesson));
  renderTutorialStatus();
  els.tutorialActions.replaceChildren();
  const actions = tutorialPage === 0 ? (lesson.actions || []) : [];
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => runTutorialAction(action));
    els.tutorialActions.appendChild(button);
  });
  setFocus(lesson.focus);
}

function getTutorialPageCount(lesson) {
  return Math.max((lesson.details || []).length + 1, 1);
}

function getTutorialPageDetails(lesson) {
  if (tutorialPage === 0) {
    return [];
  }
  return [lesson.details[tutorialPage - 1]].filter(Boolean);
}

function goTutorialPrevious() {
  if (tutorialPage > 0) {
    tutorialPage -= 1;
  } else {
    tutorialIndex = Math.max(0, tutorialIndex - 1);
    tutorialPage = getTutorialPageCount(lessons[tutorialIndex]) - 1;
  }
  renderTutorial();
}

function goTutorialNext() {
  const pageCount = getTutorialPageCount(lessons[tutorialIndex]);
  if (tutorialPage < pageCount - 1) {
    tutorialPage += 1;
  } else {
    tutorialIndex = Math.min(lessons.length - 1, tutorialIndex + 1);
    tutorialPage = 0;
  }
  renderTutorial();
}

function wireTutorialJump() {
  els.tutorialJump.replaceChildren();
  tutorialLessonGroups.forEach((group, groupIndex) => {
    const startIndex = lessonStartIndexes[groupIndex];
    const option = document.createElement("option");
    option.value = String(startIndex);
    option.textContent = group.menuLabel;
    els.tutorialJump.appendChild(option);
  });
}

function getTutorialCheck() {
  const key = lessons[tutorialIndex].checkKey || tutorialIndex;
  if (!tutorialChecks.has(key)) {
    tutorialChecks.set(key, {});
  }
  return tutorialChecks.get(key);
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
  const key = lessons[tutorialIndex].checkKey || tutorialIndex;
  tutorialChecks.set(key, {});
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
  if (els.tutorialPanel.hidden) {
    showTutorialPanel();
  } else {
    hideTutorialPanel();
  }
});

els.tutorialPrev.addEventListener("click", () => {
  goTutorialPrevious();
});

els.tutorialNext.addEventListener("click", () => {
  goTutorialNext();
});

els.tutorialJump.addEventListener("change", () => {
  tutorialIndex = Number(els.tutorialJump.value);
  tutorialPage = 0;
  renderTutorial();
});

els.tutorialResetLesson.addEventListener("click", resetLessonState);

els.tutorialExit.addEventListener("click", hideTutorialPanel);

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
wireTutorialJump();
getState().then(render);
