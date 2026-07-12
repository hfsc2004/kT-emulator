<p align="center">
  <img src="web/assets/logo.jpeg" alt="kT-RAM Neural Lane Emulator logo" width="180">
</p>

# kT-RAM Neural Lane Emulator

A small browser-based interface for experimenting with Alex Nugent's `ktram-neural-core`, the open Python emulator of the 2-1 kT-RAM neural lane described in Knowm's Neural Lane Emulator article.

The goal of this project is to make the emulator easier to poke at without living entirely inside a Python prompt or notebook. The current UI focuses on the first useful surface: one lane, one address space, one differential pair selected by AAT `(0,)`.

## What It Does

- Creates a single-synapse kT-RAM neural lane using `ktram-neural-core`
- Lets you reset the core with different model, init, seed, and read-noise settings
- Runs individual two-letter instructions such as `FF`, `FFLV`, `RH`, and `FL`
- Runs simple read/feedback cycles
- Samples noisy sub-threshold reads
- Shows live activation, conductances, magnitude, and history

## Run

```bash
./start.sh
```

That creates `.venv` if needed, installs the emulator package if missing, starts the local UI server, and opens the interface in your default browser.

To start the server without opening a browser:

```bash
./start.sh --no-browser
```

To stop the UI, press `Ctrl+C` in the terminal that started it.

## Tutorial Mode

Click `Tutorial` in the top bar to open an optional beginner path. The first tutorial slice walks through a balanced synapse, conductance reads, simple feedback, noisy low-voltage sampling, and magnitude as stored evidence.

The tutorial is still early. It is designed to stay skippable so experienced users can continue using the main emulator controls directly.

## Other Commands

Open a Python shell with the virtual environment active:

```bash
./start.sh shell
```

Run the single-synapse command-line example:

```bash
./start.sh example
```

Force dependency installation:

```bash
./start.sh install
```

## Dependency

The emulator is installed from the `chapter-4b` branch of Knowm's repository:

```text
git+https://github.com/knowm/ktram-neural-core.git@chapter-4b#subdirectory=python
```

The Python package name is `ktram-neural-core`; the import name is `ktram_neural_core`.

## Attribution And Notices

This project wraps Knowm Inc.'s `ktram-neural-core` package. The installed package metadata reports:

```text
Author: Knowm Inc.
License: MIT
```

That MIT license label applies to the emulator software package. It does not grant rights to Knowm hardware, devices, patents, or methods modeled by the emulator. Knowm's blog text and images are separate copyrighted materials unless otherwise noted.

See [NOTICE.md](NOTICE.md) for the project notice.
