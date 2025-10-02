#!/bin/bash
kill -9 $(lsof -ti :8000)

# Start Uvicorn in the background
uvicorn app.main:app --host 0.0.0.0 --port 8000 