#!/bin/bash

python bin/download_model.py
wait
uvicorn sentiment_analyzer.api:app --host 0.0.0.0 --port 80