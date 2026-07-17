# TODO: Optional Beginner Tutorial

Current version: `v0.1.7`

Goal: add an optional tutorial path for people who are new to kT-RAM and neural lanes. The tutorial should be understandable to a motivated 17-year-old: concrete language, short steps, visible cause/effect, and no assumed background in memristors or machine learning.

## Version And Release Tracking

- [x] Start version tracking at `v0.1.1`.
- [x] Show the current version in the UI footer.
- [x] Keep the current version visible in `README.md`.
- [x] Add `CHANGELOG.md` for release notes.
- [ ] Keep `README.md`, `TODO.md`, `CHANGELOG.md`, and the UI footer in sync when the version changes.

## Product Shape

- [x] Add a tutorial mode that can be opened or skipped from the main UI.
- [x] Keep the existing emulator controls available for free exploration.
- [x] Add a clear way to return from tutorial mode to the normal dashboard.
- [ ] Save no personal data; tutorial progress can stay in browser memory for now.
- [x] Make every tutorial step runnable with the current single-synapse emulator before expanding to larger examples.

## Tutorial Structure

- [x] Expand tutorial lessons from single-slide summaries into multi-step guided flows.
- [x] Lesson 1: What is this emulator?
  - [x] Explain that the app is a safe software sandbox for a kT-RAM neural lane.
  - [x] Define lane, synapse, AAT, read, feedback, conductance, and weight in plain language.
  - [x] Show where `y`, `Ga`, `Gb`, and magnitude appear in the UI.

- [x] Lesson 2: One synapse, two conductances.
  - [x] Explain that the visible weight comes from the difference between `Ga` and `Gb`.
  - [x] Let the user reset to a known starting weight.
  - [x] Ask the user to run `FF` and observe the activation.
  - [x] Add a small visual showing `Ga` vs `Gb` as a balance scale or paired bars.

- [x] Lesson 3: Reading without changing much.
  - [x] Explain read instructions at a high level.
  - [x] Compare `FF` and `FFLV`.
  - [x] Show that low-voltage reads can sample the state with less disturbance.
  - [x] Add a prompt asking the user to take several samples and notice variation.

- [x] Lesson 4: Feedback changes memory.
  - [x] Explain feedback as the instruction that nudges the synapse.
  - [x] Run a simple `FF` then `RH` cycle.
  - [x] Show the weight moving step by step.
  - [x] Ask the user to predict whether `RH` or `RL` moves the activation up or down.

- [x] Lesson 5: Magnitude as confidence/inertia.
  - [x] Explain magnitude as how much evidence has built up.
  - [x] Demonstrate that higher magnitude changes more slowly.
  - [x] Show two preset starting states with the same weight but different magnitude.
  - [ ] Add a chart annotation that points out slower movement.

- [x] Lesson 6: Noise and sampling.
  - [x] Explain noise as useful randomness, not just error.
  - [x] Use `FFLV` samples near `y = 0` to show a coin-like outcome.
  - [x] Bias the weight and show the positive/negative sample ratio change.
  - [x] Explain the idea behind `P(+) = Phi(w / sigma)` without requiring calculus.

- [x] Lesson 7: From one synapse to bigger systems.
  - [x] Explain that real uses combine many address spaces and lanes.
  - [x] Preview classifiers, memory, attractors, and random sources without implementing them yet.
  - [x] Link back to Knowm's Neural Lane Emulator article and the installed package.

- [x] Lesson 8: Guided challenge.
  - [x] Reset to a balanced state.
  - [x] Record a baseline read.
  - [x] Train a positive preference with repeated `FF/RH` cycles.
  - [x] Verify that the final read moved positive from the baseline.
  - [x] Ask the user to explain the result using `y`, `Ga`, `Gb`, and the chart.

- [x] Lesson 9: Python CLI preview.
  - [x] Add a watched virtual Linux CLI replay.
  - [x] Show deterministic project setup commands.
  - [x] Show a typed-out Python script that imports and uses `ktram_neural_core`.
  - [x] Run the scripted `python demo.py` step through the live emulator UI so readings, chart, and conductance visuals update.
  - [x] Show beige overlay callouts over the terminal on detail pages without hiding the terminal.
  - [x] Keep optional canned typed practice available internally without exposing it as a UI button.

## Capability-Gated Future Lessons

These are intentionally not current tutorial lessons until the emulator exposes runnable behavior for them. Do not add them to the tutorial dropdown as normal lessons while they are explanation-only.

- [ ] Logic gates lesson.
  - Blocked until the emulator exposes a runnable logic-gate example or multi-synapse composition that the UI can drive.
- [ ] Supervised classifier lesson.
  - Blocked until the emulator exposes a runnable classifier workflow with examples, labels, feedback, and visible training results.
- [ ] Auto-encoder lesson.
  - Blocked until the emulator exposes a runnable encoding/reconstruction workflow.
- [ ] Multi-lane or multi-address AAT lesson.
  - Blocked until the UI can select or visualize more than the current single visible address.
- [ ] Attractor or memory-system lesson.
  - Blocked until the emulator exposes a runnable state-recall or attractor demonstration.

## Python Integration Tutorial Series

Goal: add a separate tutorial path that teaches how to embed the emulator in a small utilitarian Python program. The UI should present a virtual Linux CLI that looks like a real terminal running Python commands, but the user does not need to type. Each step should reveal the command, the Python code, and the output as a scripted demonstration.

- [x] Add a virtual CLI tutorial surface.
  - [x] Make it look like a Linux terminal with prompt text, command output, Python file views, and run results.
  - [x] Keep watched deterministic replay as the default lesson mode.
  - [x] Add optional typed practice mode with deterministic canned responses, not a real shell, and keep it out of the user-facing UI.
  - [x] Let scripted CLI blocks trigger live emulator actions for visible UI feedback.
  - [x] Add overlay callouts for CLI detail pages so the terminal stays visible while explanations appear.
  - [ ] Use copyable command/code blocks only where helpful; do not require keyboard input.
  - [x] Keep the virtual CLI visually distinct from the real emulator controls so users do not mistake it for a live shell.
- [ ] Choose one real utilitarian example.
  - [ ] Prefer a practical decision helper, such as a tiny sensor-threshold assistant, spam/not-spam toy filter, quality-control pass/fail helper, or recommendation preference demo.
  - [ ] Use data small enough to show in the tutorial without scrolling through large files.
  - [ ] Keep the example honest: one visible lane/synapse first unless the emulator/API grows beyond that.
- [ ] Lesson CLI-1: create the project.
  - [x] Show a virtual command like `mkdir ktram-demo && cd ktram-demo`.
  - [x] Show creating a virtual environment and installing/importing the emulator dependency.
  - [x] Explain what files will exist before showing code.
- [ ] Lesson CLI-2: write the smallest Python script.
  - [x] Show `demo.py` importing the emulator package.
  - [x] Create/reset one lane or equivalent current emulator object.
  - [x] Print initial `y`, `Ga`, `Gb`, and magnitude.
- [ ] Lesson CLI-3: wrap reads and feedback in helper functions.
  - [ ] Show a `read_state()` helper for read instructions.
  - [ ] Show a `train_positive()` or equivalent helper that runs repeated read/feedback cycles.
  - [ ] Print before/after state so the program output mirrors the browser tutorial.
- [ ] Lesson CLI-4: connect the emulator to a utilitarian decision.
  - [ ] Map a simple input signal to a read/train decision.
  - [ ] Show a tiny dataset or sequence of examples.
  - [ ] Keep the utility concrete, such as "prefer this option after repeated positive feedback" or "flag this input after training."
- [ ] Lesson CLI-5: run and interpret the program.
  - [x] Show the virtual command `python demo.py`.
  - [x] Show terminal output generated from the current live emulator run.
  - [x] Explain what changed in plain language and point back to the browser readings.
- [ ] Lesson CLI-6: safe next steps.
  - [ ] Explain what this toy program demonstrates.
  - [ ] Explain what it does not demonstrate yet.
  - [ ] Link the CLI example back to `examples/` and future runnable examples.
- [ ] Add actual example files to back the virtual CLI tutorial.
  - [ ] Add a runnable Python example matching the virtual CLI output.
  - [ ] Add a short README or comments for running it locally.
  - [ ] Add a smoke test or documented manual check so the scripted output does not drift from the code.

## Lesson Scenarios And Real-World Framing

- [x] Add a real-world scenario to every current tutorial step before the technical explanation.
- [x] Add a short "why would someone do this?" prompt to every current tutorial step.
- [x] Lesson 1 scenario: a safe training sandbox.
  - [x] Example: before testing a new aircraft control idea, engineers use a simulator so mistakes do not damage real hardware.
  - [x] Connect that to this emulator as a safe place to learn how one kT-RAM lane behaves.
- [x] Lesson 2 scenario: comparing two signals.
  - [x] Example: a thermostat compares "too cold" and "too hot" signals before deciding which way to lean.
  - [x] Connect that to `Ga` and `Gb` as two sides whose difference creates activation `y`.
- [x] Lesson 3 scenario: checking a state without disturbing it much.
  - [x] Example: checking a battery level should not drain the battery significantly.
  - [x] Connect that to low-voltage reads like `FFLV` as a gentler way to sample the current state.
- [x] Lesson 4 scenario: teaching a simple preference.
  - [x] Example: a spam filter gets feedback that a message was spam, so it nudges future decisions.
  - [x] Connect that to `FF` plus `RH` or `RL` feedback changing the stored conductance state.
- [x] Lesson 5 scenario: confidence from repeated evidence.
  - [x] Example: one customer review is weak evidence, but hundreds of reviews are harder to overturn.
  - [x] Connect that to magnitude as stored evidence or inertia.
- [x] Lesson 6 scenario: making decisions under uncertainty.
  - [x] Example: a recommendation system may show different options when confidence is low, then settle as evidence grows.
  - [x] Connect that to noisy low-voltage sampling and positive/negative sample ratios.
- [x] Lesson 7 scenario: scaling one learned signal into a system.
  - [x] Example: a face detector, weather model, or robot controller combines many small signals instead of trusting one measurement.
  - [x] Connect that to many lanes, address spaces, and synapses working together.
- [x] Add a useful first project lesson: teach one synapse to lean positive.
  - Scenario: storing a tiny preference after feedback, like "this input should usually count as yes."
  - Steps: reset balanced, read with `FF`, run several `FF/RH` cycles, read again, confirm `y` moved positive.
  - Success condition: `y` is greater than its starting value and the UI explains that feedback changed memory.

## Emulator Roadmap Framing

- [x] Add a tutorial ending that distinguishes current emulator scope from future directions.
- [x] State that the current UI teaches primitive lane behavior: reads, feedback, noise, conductance balance, and stored evidence.
- [x] Preview logic gates as a likely next educational layer.
- [x] Preview supervised classifiers as a later layer built from feedback and examples.
- [x] Preview auto-encoders as a later layer built from learned internal representations.
- [ ] Add roadmap links or references when public articles/examples are available.
- [ ] Add future lessons only after the emulator exposes matching runnable examples.

## Computer Model Comparison

- [x] Add a tutorial segment comparing conventional computers with kT-RAM.
- [x] Start with a high-level explanation of a conventional computer.
  - Explain CPU, memory, instructions, and stored data in plain language.
  - Describe the normal fetch/decode/execute loop without assuming prior computer architecture knowledge.
  - Emphasize that most conventional programs move data between separate memory and processing units.
- [x] Start with a high-level explanation of kT-RAM.
  - Explain that kT-RAM uses adaptive memory elements whose conductance stores learned state.
  - Explain that read and feedback operations are tied closely to memory behavior.
  - Emphasize that the tutorial app shows an emulator model, not a full hardware simulator.
- [x] Add real examples that users can follow.
  - Compare a conventional program reading a number, changing it, and writing it back.
  - Compare a kT-RAM lane reading conductance, producing an activation, and applying feedback.
  - Use one shared example, such as learning whether an input should lean positive or negative.
  - Show which UI values correspond to the example: `y`, `Ga`, `Gb`, weight, magnitude, and instruction history.
- [x] Add low-level explanations that line up with the high-level examples.
  - For conventional computers, connect bits, registers, memory addresses, arithmetic, and branching back to the high-level example.
  - For kT-RAM, connect AAT selection, paired conductances, differential weight, read voltage, noise, and feedback back to the same example.
  - Keep the low-level section grounded in what the current single-synapse emulator can demonstrate.
- [x] Add visual comparison aids.
  - Show a conventional computer flow: memory to CPU to memory.
  - Show a kT-RAM flow: selected synapse to activation to feedback-adjusted conductance.
  - Use side-by-side diagrams or cards only if they remain readable on mobile.
- [x] Add vocabulary bridges between the two models.
  - Map "memory address" to AAT/address selection carefully.
  - Map "stored value" to conductance state carefully.
  - Explain where the analogy breaks so users do not confuse software variables with physical conductance.

## UI Work

- [x] Add a tutorial panel or route, separate from the dense control panel.
- [x] Add a guided bubble tour that explains the main windows, controls, and instruction buttons.
- [x] Rearrange the UI into a compact app shell with top readings, persistent left controls, chart plus visual readouts, and a toggleable tutorial panel beneath the right-side displays.
- [x] Keep the tutorial panel a fixed size and page long lesson text so navigation controls stay in place.
- [x] Add Back, Next, Reset Lesson, and Close tutorial controls.
- [x] Highlight the UI element being discussed in the current step.
- [x] Add controlled actions for tutorial steps, such as "Run FF once" or "Run 10 cycles".
- [x] Add inline checks that confirm the user completed current action-based tutorial steps.
  - Informational comparison and roadmap steps remain read-only for now.
- [x] Add concise explanations next to the chart and metrics.
- [x] Add a glossary drawer or popover for terms.
- [x] Add a "Reset lesson state" button so users can recover from experiments.
- [ ] Make tutorial text fit on mobile and desktop without overlapping controls.

## Emulator/API Work

- [x] Add API endpoints for deterministic tutorial presets.
- [x] Add a preset for balanced weight: `y = 0`.
- [x] Add presets for positive and negative weights.
- [x] Add presets for same weight with low/high magnitude.
- [ ] Add a batch instruction endpoint that returns intermediate history.
- [ ] Add a sampling endpoint that returns positive/negative counts and sample values.
- [ ] Keep tutorial runs reproducible with fixed seeds.
- [ ] Ensure tutorial endpoints do not break free exploration mode.

## Visualizations

- [x] Add paired bars for `Ga` and `Gb`.
- [x] Add a normalized weight gauge from `-1` to `+1`.
- [ ] Add magnitude/confidence visualization.
- [x] Add sample histogram for noisy reads.
- [ ] Add chart markers for tutorial actions.
- [x] Add visual distinction between read instructions and feedback instructions.

## Content Standards

- [ ] Use short sentences and concrete examples.
- [ ] Avoid unexplained math symbols in first-use explanations.
- [ ] Define every new term before using it heavily.
- [ ] Prefer "what you should see" over abstract descriptions.
- [ ] Add "why this matters" notes only after the interaction.
- [ ] Keep each lesson under five minutes.
- [ ] Avoid claiming hardware behavior beyond what the emulator demonstrates.
- [ ] Preserve Knowm attribution and IP/license caveats.

## Examples And Tests

- [ ] Keep `examples/single_synapse.py` aligned with tutorial Lesson 2-4.
- [ ] Add `examples/noisy_sampling.py` for Lesson 6.
- [ ] Add lightweight tests for tutorial API presets.
- [ ] Add a manual QA checklist for each lesson.
- [ ] Test start/stop cleanup after using tutorial mode.
- [ ] Test browser auto-open still works.
- [ ] Test all tutorial steps on a narrow mobile viewport.

## Documentation

- [x] Add a README section for tutorial mode once implemented.
- [x] Add a short "For teachers/parents" note explaining what the tutorial covers.
- [x] Link to `NOTICE.md` from tutorial attribution text.
- [x] Document how to run examples from the command line.
- [x] Document known limitations: single-synapse first, not a full hardware simulator UI yet.

## Open Questions

- [ ] Should tutorial progress reset on refresh or persist in local storage?
- [x] Should the tutorial be linear only, or allow jumping between lessons? Decision: add a tutorial dropdown so users can jump between current tutorial steps.
- [ ] Should examples use only the `float` model at first?
- [ ] Should we include diagrams, or keep everything driven by live emulator state?
- [x] Should the tutorial eventually include a small challenge/project at the end? Decision: add Lesson 8 as a guided read-train-read challenge.
