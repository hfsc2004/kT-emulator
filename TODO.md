# TODO: Optional Beginner Tutorial

Goal: add an optional tutorial path for people who are new to kT-RAM and neural lanes. The tutorial should be understandable to a motivated 17-year-old: concrete language, short steps, visible cause/effect, and no assumed background in memristors or machine learning.

## Product Shape

- [x] Add a tutorial mode that can be opened or skipped from the main UI.
- [x] Keep the existing emulator controls available for free exploration.
- [x] Add a clear way to return from tutorial mode to the normal dashboard.
- [ ] Save no personal data; tutorial progress can stay in browser memory for now.
- [x] Make every tutorial step runnable with the current single-synapse emulator before expanding to larger examples.

## Tutorial Structure

- [ ] Lesson 1: What is this emulator?
  - Explain that the app is a safe software sandbox for a kT-RAM neural lane.
  - Define lane, synapse, AAT, read, feedback, conductance, and weight in plain language.
  - Show where `y`, `Ga`, `Gb`, and magnitude appear in the UI.

- [ ] Lesson 2: One synapse, two conductances.
  - Explain that the visible weight comes from the difference between `Ga` and `Gb`.
  - Let the user reset to a known starting weight.
  - Ask the user to run `FF` and observe the activation.
  - Add a small visual showing `Ga` vs `Gb` as a balance scale or paired bars.

- [ ] Lesson 3: Reading without changing much.
  - Explain read instructions at a high level.
  - Compare `FF` and `FFLV`.
  - Show that low-voltage reads can sample the state with less disturbance.
  - Add a prompt asking the user to take several samples and notice variation.

- [ ] Lesson 4: Feedback changes memory.
  - Explain feedback as the instruction that nudges the synapse.
  - Run a simple `FF` then `RH` cycle.
  - Show the weight moving step by step.
  - Ask the user to predict whether `RH` or `RL` moves the activation up or down.

- [ ] Lesson 5: Magnitude as confidence/inertia.
  - Explain magnitude as how much evidence has built up.
  - Demonstrate that higher magnitude changes more slowly.
  - Show two preset starting states with the same weight but different magnitude.
  - Add a chart annotation that points out slower movement.

- [ ] Lesson 6: Noise and sampling.
  - Explain noise as useful randomness, not just error.
  - Use `FFLV` samples near `y = 0` to show a coin-like outcome.
  - Bias the weight and show the positive/negative sample ratio change.
  - Explain the idea behind `P(+) = Phi(w / sigma)` without requiring calculus.

- [ ] Lesson 7: From one synapse to bigger systems.
  - Explain that real uses combine many address spaces and lanes.
  - Preview classifiers, memory, attractors, and random sources without implementing them yet.
  - Link back to Knowm's Neural Lane Emulator article and the installed package.

## Lesson Scenarios And Real-World Framing

- [x] Add a real-world scenario to every current tutorial step before the technical explanation.
- [x] Add a short "why would someone do this?" prompt to every current tutorial step.
- [ ] Lesson 1 scenario: a safe training sandbox.
  - Example: before testing a new aircraft control idea, engineers use a simulator so mistakes do not damage real hardware.
  - Connect that to this emulator as a safe place to learn how one kT-RAM lane behaves.
- [ ] Lesson 2 scenario: comparing two signals.
  - Example: a thermostat compares "too cold" and "too hot" signals before deciding which way to lean.
  - Connect that to `Ga` and `Gb` as two sides whose difference creates activation `y`.
- [ ] Lesson 3 scenario: checking a state without disturbing it much.
  - Example: checking a battery level should not drain the battery significantly.
  - Connect that to low-voltage reads like `FFLV` as a gentler way to sample the current state.
- [ ] Lesson 4 scenario: teaching a simple preference.
  - Example: a spam filter gets feedback that a message was spam, so it nudges future decisions.
  - Connect that to `FF` plus `RH` or `RL` feedback changing the stored conductance state.
- [ ] Lesson 5 scenario: confidence from repeated evidence.
  - Example: one customer review is weak evidence, but hundreds of reviews are harder to overturn.
  - Connect that to magnitude as stored evidence or inertia.
- [ ] Lesson 6 scenario: making decisions under uncertainty.
  - Example: a recommendation system may show different options when confidence is low, then settle as evidence grows.
  - Connect that to noisy low-voltage sampling and positive/negative sample ratios.
- [ ] Lesson 7 scenario: scaling one learned signal into a system.
  - Example: a face detector, weather model, or robot controller combines many small signals instead of trusting one measurement.
  - Connect that to many lanes, address spaces, and synapses working together.
- [ ] Add a useful first project lesson: teach one synapse to lean positive.
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
- [x] Add Back, Next, Restart, and Exit Tutorial controls.
- [x] Highlight the UI element being discussed in the current step.
- [x] Add controlled actions for tutorial steps, such as "Run FF once" or "Run 10 cycles".
- [ ] Add inline checks that confirm the user completed the step.
- [ ] Add concise explanations next to the chart and metrics.
- [ ] Add a glossary drawer or popover for terms.
- [ ] Add a "Reset lesson state" button so users can recover from experiments.
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
- [ ] Add visual distinction between read instructions and feedback instructions.

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

- [ ] Add a README section for tutorial mode once implemented.
- [ ] Add a short "For teachers/parents" note explaining what the tutorial covers.
- [ ] Link to `NOTICE.md` from tutorial attribution text.
- [ ] Document how to run examples from the command line.
- [ ] Document known limitations: single-synapse first, not a full hardware simulator UI yet.

## Open Questions

- [ ] Should tutorial progress reset on refresh or persist in local storage?
- [ ] Should the tutorial be linear only, or allow jumping between lessons?
- [ ] Should examples use only the `float` model at first?
- [ ] Should we include diagrams, or keep everything driven by live emulator state?
- [ ] Should the tutorial eventually include a small challenge/project at the end?
