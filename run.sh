#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

# ── 1. Ensure pip3 is available ───────────────────────────────────────────────
if ! command -v pip3 &>/dev/null; then
    echo "[setup] pip3 not found — installing..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get update -qq && sudo apt-get install -y python3-pip
    elif command -v dnf &>/dev/null; then
        sudo dnf install -y python3-pip
    elif command -v brew &>/dev/null; then
        brew install python3
    else
        echo "[error] Cannot install pip3 automatically. Please install it manually."
        exit 1
    fi
fi

# ── 2. Create virtual environment if it doesn't exist ────────────────────────
if [ ! -d "$VENV_DIR" ]; then
    echo "[setup] Creating virtual environment at .venv ..."
    python3 -m venv "$VENV_DIR"
fi

# ── 3. Activate virtual environment ──────────────────────────────────────────
echo "[setup] Activating .venv ..."
# shellcheck source=/dev/null
source "$VENV_DIR/bin/activate"

# ── 4. Upgrade pip inside venv and install dependencies ──────────────────────
echo "[setup] Installing dependencies ..."
pip install --upgrade pip --quiet
pip install pandas matplotlib seaborn plotly numpy --quiet

# ── 5. Run the application ────────────────────────────────────────────────────
echo "[setup] Setup complete. Starting ..."
echo ""
python3 "$SCRIPT_DIR/*.py"
