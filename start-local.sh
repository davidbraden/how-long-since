#!/bin/bash
# This script starts a simple web server and opens the browser.

echo "Starting local web server on port 8000..."
# Start the server in the background
python3 -m http.server &

# Give the server a moment to initialize
sleep 1

echo "Opening application in your default browser..."
# Open the URL (works on macOS)
open http://localhost:8000
