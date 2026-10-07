"""
Labs P1: classify one batch of comments with OpenAI, for the Elixir ClassifyCommentsWorker.

Called over erlport. The prompt and comments come from Elixir (the prompt lives in
priv/prompts/p1/); the API key is read from the OPENAI_API_KEY environment variable.
The result is returned as UTF-8 JSON bytes and never raises, so failed calls can be logged:

    {"status": "ok" | "error", "error": str | None, "results": [{comment_id, category, remark}],
     "input_tokens": int | None, "output_tokens": int | None, "latency_ms": int,
     "request": {...}, "response": {...} | None}
"""

import json
import logging
import time

from openai import OpenAI

CATEGORIES = {"abusive", "neutral_spam", "worth_engaging"}


def _text(value):
    return value.decode("utf-8") if isinstance(value, bytes) else value


def classify_batch(model, prompt, comments_json):
    """`comments_json` is a JSON list of {"id": ..., "text": ...}."""
    model, prompt = _text(model), _text(prompt)
    comments = json.loads(comments_json)

    # The model copies short numbers far more reliably than long comment IDs, so the
    # batch is numbered 1..N and the numbers are mapped back to IDs below.
    numbered = [
        {"n": n, "text": c["text"] or ""} for n, c in enumerate(comments, start=1)
    ]
    request = {
        "model": model,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": json.dumps(numbered, ensure_ascii=False)},
        ],
    }
    result = {
        "status": "error",
        "error": None,
        "results": [],
        "input_tokens": None,
        "output_tokens": None,
        "latency_ms": 0,
        # Keep the n -> comment ID mapping with the request, so a call can be reproduced.
        "request": {**request, "ids": [c["id"] for c in comments]},
        "response": None,
    }

    started = time.monotonic()
    try:
        response = OpenAI().chat.completions.create(**request)
        result["latency_ms"] = int((time.monotonic() - started) * 1000)
        result["response"] = response.model_dump(mode="json")
        if response.usage:
            result["input_tokens"] = response.usage.prompt_tokens
            result["output_tokens"] = response.usage.completion_tokens

        message = response.choices[0].message
        if message.refusal:
            result["error"] = f"Model refused: {message.refusal}"
        else:
            result["results"] = _parse(message.content, comments)
            result["status"] = "ok"
    except Exception as e:
        logging.exception("OpenAI classification call failed")
        result["latency_ms"] = int((time.monotonic() - started) * 1000)
        result["error"] = f"OpenAI call failed: {e}"

    return json.dumps(result, ensure_ascii=False).encode("utf-8")


# Keeps only well-formed results for numbers in the batch, first answer per number.
def _parse(content, comments):
    parsed = json.loads(content).get("results", [])
    seen, results = set(), []
    for r in parsed:
        n = r.get("n")
        if not isinstance(n, int) or not 1 <= n <= len(comments) or n in seen:
            continue
        if r.get("category") not in CATEGORIES:
            continue
        seen.add(n)
        results.append(
            {
                "comment_id": comments[n - 1]["id"],
                "category": r["category"],
                "remark": r.get("remark"),
            }
        )
    return results
