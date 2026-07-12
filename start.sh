#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$PROJECT_DIR/.venv"
PYTHON_BIN="${PYTHON:-python3}"
cd "$PROJECT_DIR"

usage() {
  cat <<'EOF'
kT-RAM Neural Lane Emulator Linux/macOS installation and run helper

Usage:
  ./start.sh [command] [options]

Commands:
  ui        Set up dependencies if needed, then start the browser UI. Default.
  setup     Create .venv and install all Python dependencies, then exit.
  install   Alias for setup.
  doctor    Check local prerequisites and installed emulator import.
  example   Set up dependencies if needed, then run examples/single_synapse.py.
  shell     Set up dependencies if needed, then open Python from the project venv.
  help      Show this help.

Common UI options:
  ./start.sh --no-browser
  ./start.sh ui --host 127.0.0.1 --port 8000 --no-browser

Environment:
  PYTHON=/path/to/python3 ./start.sh setup
EOF
}

log() {
  printf '==> %s\n' "$*"
}

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "Missing required command '$1'. Install it and rerun ./start.sh setup."
  fi
}

check_prerequisites() {
  require_command "$PYTHON_BIN"
  require_command git

  if ! "$PYTHON_BIN" -m venv --help >/dev/null 2>&1; then
    fail "Python venv support is missing. Install the python3-venv package for your system."
  fi
}

ensure_venv() {
  check_prerequisites

  if [ ! -x "$VENV_DIR/bin/python" ]; then
    log "Creating virtual environment at .venv"
    "$PYTHON_BIN" -m venv "$VENV_DIR"
  fi
}

# shellcheck disable=SC1091
activate_venv() {
  source "$VENV_DIR/bin/activate"
}

install_dependencies() {
  log "Installing Python dependencies"
  python -m pip install -r requirements.txt
}

ensure_dependencies() {
  local force="${1:-0}"
  ensure_venv
  activate_venv

  if [ "$force" = "1" ] || ! python -c "import ktram_neural_core" >/dev/null 2>&1; then
    install_dependencies
  fi
}

doctor() {
  check_prerequisites
  printf 'Project: %s\n' "$PROJECT_DIR"
  printf 'Python command: %s\n' "$(command -v "$PYTHON_BIN")"
  "$PYTHON_BIN" --version
  printf 'Git command: %s\n' "$(command -v git)"
  git --version

  if [ -x "$VENV_DIR/bin/python" ]; then
    printf 'Virtual environment: %s\n' "$VENV_DIR"
    # shellcheck disable=SC1091
    source "$VENV_DIR/bin/activate"
    python -m pip --version
    if python -c "import ktram_neural_core" >/dev/null 2>&1; then
      printf 'ktram_neural_core import: ok\n'
    else
      printf 'ktram_neural_core import: missing; run ./start.sh setup\n'
    fi
  else
    printf 'Virtual environment: missing; run ./start.sh setup\n'
  fi
}

COMMAND="${1:-ui}"
if [ "${COMMAND#-}" != "$COMMAND" ]; then
  COMMAND="ui"
else
  shift || true
fi

case "$COMMAND" in
  ui)
    ensure_dependencies 0
    exec python app.py "$@"
    ;;
  setup | install)
    ensure_dependencies 1
    log "Setup complete. Run ./start.sh to open the UI."
    ;;
  doctor)
    doctor
    ;;
  shell)
    ensure_dependencies 0
    exec python "$@"
    ;;
  example)
    ensure_dependencies 0
    exec python examples/single_synapse.py
    ;;
  help | -h | --help)
    usage
    ;;
  *)
    usage
    fail "Unknown command: $COMMAND"
    ;;
esac
