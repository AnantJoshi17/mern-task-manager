#!/usr/bin/env bash
# setup.sh — run this once to get the project ready.
#   Mac / Linux:  bash setup.sh
#
# It installs dependencies, creates your .env files, and opens VS Code.

set -e # stop immediately if any command fails

echo ""
echo "Setting up the MERN Task Manager"
echo "================================"
echo ""

# --- Check Node is installed ---
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed."
  echo "Install it from https://nodejs.org (choose the LTS version), then run this again."
  exit 1
fi

echo "Node.js $(node -v) found."
echo ""

# --- Create .env files from the examples, but never overwrite existing ones ---
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "Created server/.env  — you still need to put your MongoDB URI in it."
else
  echo "server/.env already exists, leaving it alone."
fi

if [ ! -f client/.env ]; then
  cp client/.env.example client/.env
  echo "Created client/.env  — no changes needed for local work."
else
  echo "client/.env already exists, leaving it alone."
fi

echo ""
echo "Installing backend packages..."
(cd server && npm install --no-audit --no-fund)

echo ""
echo "Installing frontend packages..."
(cd client && npm install --no-audit --no-fund)

echo ""
echo "Installing the script that runs both at once..."
npm install --no-audit --no-fund

# --- Open VS Code if it is available ---
echo ""
if command -v code >/dev/null 2>&1; then
  code .
  echo "VS Code opened."
else
  echo "The 'code' command is not on your PATH, so I could not open VS Code."
  echo "Open VS Code, press Cmd+Shift+P, and run 'Shell Command: Install code command in PATH'."
  echo "Or just open this folder through File > Open Folder."
fi

echo ""
echo "================================"
echo "Done. Two things left:"
echo ""
echo "  1. Put your MongoDB connection string in server/.env"
echo "     (free database at https://www.mongodb.com/atlas — see README)"
echo ""
echo "  2. Run:  npm run dev"
echo "     Then open http://localhost:5173"
echo ""
