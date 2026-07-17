<p align="center">
  <img src="web/assets/logo.jpeg" alt="kT-RAM Neural Lane Emulator logo" width="180">
</p>

# kT-RAM Neural Lane Emulator

Current version: `v0.1.5`

Browser-based explorer for Knowm's kT-RAM neural lane emulator, with live controls, visual gauges, noisy read sampling, and an optional beginner tutorial.

<p align="center">
  <img src="web/assets/Screenshot.png?v=0.1.5" alt="kT-RAM Neural Lane Emulator browser interface" width="900">
</p>

This project wraps `ktram-neural-core`, the open Python emulator of the 2-1 kT-RAM neural lane described in Knowm's [Neural Lane Emulator article](https://knowm.ai/blog/the-neural-lane-emulator/). The goal is to make the emulator easier to explore without living entirely inside a Python prompt or notebook.

The current UI focuses on the first useful surface: one lane, one address space, one differential pair selected by AAT `(0,)`.

## What It Does

- Creates a single-synapse kT-RAM neural lane using `ktram-neural-core`
- Lets you reset the core with different model, init, seed, and read-noise settings
- Runs individual two-letter instructions such as `FF`, `FFLV`, `RH`, and `FL`
- Runs simple read/feedback cycles
- Samples noisy sub-threshold reads
- Shows live activation, conductances, magnitude, history, visual gauges, and sample splits
- Includes a skippable beginner tutorial for new kT-RAM users

## Installation

First, download the project with Git and enter the project folder:

```bash
git clone https://github.com/hfsc2004/kT-emulator.git
cd kT-emulator
```

Then start the app for your platform. The launcher creates `.venv`, installs what the app needs, starts the local UI server, and opens the interface in your default browser.

| Platform | Start the UI |
| --- | --- |
| Linux | `./start.sh` |
| macOS | `./start.command` |
| Windows | `start.bat` |

To start the server without opening a browser:

```bash
./start.sh --no-browser
```

```bash
./start.command --no-browser
```

```bat
start.bat --no-browser
```

To stop the UI, press `Ctrl+C` in the terminal that started it.

## Tutorial Mode

Click `Tutorial` in the top bar to open the beginner path. The tutorial now opens by default and includes eight lessons covering the emulator sandbox, paired conductances, reads, feedback, magnitude, noisy sampling, bigger-system framing, and a guided read-train-read challenge. Visual cards show the `Ga`/`Gb` balance, a `-1` to `+1` weight gauge, and the positive/negative split from noisy reads.

The tutorial stays skippable so experienced users can continue using the main emulator controls directly.

For teachers and parents: the tutorial is intended as a concrete introduction to adaptive memory ideas. It focuses on visible cause and effect: read the state, apply feedback, then observe how the stored conductance pair changes.

Known limitations: the current UI demonstrates one lane, one selected address, and one visible differential conductance pair. It is an educational emulator surface, not a full hardware simulator UI, and future lessons for logic gates, classifiers, auto-encoders, multi-lane examples, or attractor behavior should wait until those behaviors are runnable in the app.

See [NOTICE.md](NOTICE.md) for attribution and IP/license notes.

## Other Commands

| Task | Linux | macOS | Windows |
| --- | --- | --- | --- |
| Open a Python shell | `./start.sh shell` | `./start.command shell` | `start.bat shell` |
| Run the example | `./start.sh example` | `./start.command example` | `start.bat example` |
| Show help | `./start.sh help` | `./start.command help` | `start.bat help` |

## Troubleshooting

If the app does not start, check the local environment:

| Platform | Check environment |
| --- | --- |
| Linux | `./start.sh doctor` |
| macOS | `./start.command doctor` |
| Windows | `start.bat doctor` |

To install dependencies without starting the UI:

| Platform | Install only |
| --- | --- |
| Linux | `./start.sh setup` |
| macOS | `./start.command setup` |
| Windows | `start.bat setup` |

To force dependency installation again:

| Platform | Force install |
| --- | --- |
| Linux | `./start.sh install` |
| macOS | `./start.command install` |
| Windows | `start.bat install` |

## Dependency

The emulator is installed from the `chapter-4b` branch of Knowm's repository:

```text
git+https://github.com/knowm/ktram-neural-core.git@chapter-4b#subdirectory=python
```

The Python package name is `ktram-neural-core`; the import name is `ktram_neural_core`.

## Knowm Resources

- [Knowm Inc.](https://knowm.org)
- [Knowm's Blog](https://knowm.ai)
- [The Neural Lane Emulator](https://knowm.ai/blog/the-neural-lane-emulator/)

## Attribution And Notices

This project wraps [Knowm Inc.](https://knowm.org)'s `ktram-neural-core` package and follows the emulator work published on [Knowm's Blog](https://knowm.ai), including [The Neural Lane Emulator](https://knowm.ai/blog/the-neural-lane-emulator/). The installed package metadata reports:

```text
Author: Knowm Inc.
License: MIT
```

That MIT license label applies to the emulator software package. It does not grant rights to Knowm hardware, devices, patents, or methods modeled by the emulator. Knowm's blog text and images are separate copyrighted materials unless otherwise noted.

See [NOTICE.md](NOTICE.md) for the project notice.
