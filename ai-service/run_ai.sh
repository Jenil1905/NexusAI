#!/bin/bash
# Robust helper script to run AI Service

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Detect Virtual Environment
VENV_PATH=""
if [ -f "./venv/bin/python" ]; then
    VENV_PATH="./venv"
elif [ -f "./.venv/bin/python" ]; then
    VENV_PATH="./.venv"
fi

if [ -z "$VENV_PATH" ]; then
    echo "❌ Virtual environment not found."
    echo "💡 Run: python3 -m venv venv && ./venv/bin/pip install -r requirements.txt"
    exit 1
fi

# 2. Check for Port Conflicts (Port 8000)
PORT=8000
PID=$(lsof -t -i:$PORT)
if [ ! -z "$PID" ]; then
    echo "⚠️  Port $PORT is already in use by process $PID."
    echo "🔄 Killing old process to restart..."
    kill -9 $PID
    sleep 1
fi

# 3. Handle Arguments
RELOAD_FLAG=""
if [[ "$1" == "--reload" || "$1" == "--dev" ]]; then
    echo "🔥 Hot-reload enabled."
    # We'll use uvicorn's reload feature directly if requested
    $VENV_PATH/bin/python -m uvicorn main:app --host 0.0.0.0 --port $PORT --reload
else
    echo "🚀 Starting Nexus AI Service..."
    $VENV_PATH/bin/python main.py
fi
