# Changelog

## v0.1.8

- Added a local Monitor API so external programs can stream neural activity snapshots into the dashboard visuals.
- Split monitor server logic into `monitor_api.py` and browser polling into `web/monitor.js`.
- Added `/api/monitor/state`, `/api/monitor/event`, `/api/monitor/series`, and `/api/monitor/reset` endpoints.
- Updated the UI to render external monitor snapshots through the existing readings, chart, conductance balance, and weight gauge.
- Expanded README with Monitor API endpoint docs, JSON payloads, a fail-safe Python `MonitorClient`, and a fork-output example.

## v0.1.7

- Updated Lesson 9 copy so the Python CLI preview explains the emulator workflow instead of the tutorial mechanism.
- Wired the scripted `python demo.py` replay to run the live emulator sequence and update readings, history, conductance balance, and gauge visuals.
- Kept the virtual terminal visible on CLI detail pages and added beige overlay callouts for explanatory notes.
- Removed the visible typed-practice control while keeping the internal deterministic typed-command capability available for future lessons.
- Tightened the right-side visual cards and enlarged the tutorial area for the CLI lesson.

## v0.1.6

- Planned a future virtual Linux/Python CLI tutorial series for embedding the emulator in a utilitarian example program.
- Added a reusable virtual CLI tutorial component with deterministic replay and optional canned typed practice.
- Added Lesson 9 as a virtual Python CLI preview using the new terminal replay component.

## v0.1.5

- Added concise read-only explanations to the top metrics and history chart.
- Added an instruction legend that distinguishes read buttons from feedback buttons.
- Added a glossary dialog for common emulator and tutorial terms.
- Expanded README tutorial documentation with teacher/parent framing, limitations, and attribution links.

## v0.1.4

- Added real-world scenario and "why would someone do this?" framing across the tutorial lessons.
- Added Lesson 8 as a guided read-train-read challenge that verifies a trained positive preference.
- Clarified that future lessons requiring logic gates, classifiers, auto-encoders, multi-lane examples, or attractor behavior are capability-gated until the emulator can run them.
- Updated README tutorial mode notes for the current eight-lesson flow.

## v0.1.3

- Added brief mouse-over names for compact controls and instruction buttons.
- Updated README screenshot cache-buster and project version references.

## v0.1.2

- Bumped project version after the tutorial and compact layout update.
- Kept version references synchronized across the UI footer, README, TODO, and changelog.

## v0.1.1

- Added an Interface Tour with guided bubbles for the main UI areas and instruction buttons.
- Made read-only readings visually darker than adjustable/configurable controls.
- Added read-only and adjustable/action labels to clarify what can be changed.
- Added a tutorial lesson jump dropdown.
- Began expanding tutorial lessons into multi-step guided flows using Knowm's blog series as source material.
- Added visible app versioning in the UI footer and README.
