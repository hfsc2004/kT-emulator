#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

CREATED_VENV=0
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  CREATED_VENV=1
fi

# shellcheck disable=SC1091
source .venv/bin/activate

if [ "$CREATED_VENV" = "1" ] || [ "${1:-}" = "install" ] || ! python -c "import ktram_neural_core" >/dev/null 2>&1; then
  python -m pip install -r requirements.txt
  if [ "${1:-}" = "install" ]; then
    exit 0
  fi
fi

case "${1:-ui}" in
  ui)
    exec python app.py
    ;;
  shell)
    shift || true
    exec python "$@"
    ;;
  example)
    exec python examples/single_synapse.py
    ;;
esac

exec python "$@"
