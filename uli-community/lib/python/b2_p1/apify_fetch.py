"""
Labs B2_P1: fetch one Instagram post's comments with Apify, for the Elixir FetchCommentsWorker.

Called over erlport. Arguments arrive as bytes; the result is returned as UTF-8 JSON bytes
(an Elixir binary) and never raises, so the worker can record failures on the run:

    {"status": "ok" | "error", "error": str | None, "run": <Apify Run as JSON> | None, "items": [...]}
"""

import json
import logging
from datetime import timedelta

from apify_client import ApifyClient

# Scraper name (as stored on b2_p1_runs.scraper) -> Apify actor.
ACTORS = {
    "with_replies": "apify/instagram-comment-scraper",
    "basic": "scrapesmith/instagram-comments-scraper",
}

# Apify stops a run that takes longer than this (it then comes back as TIMED-OUT).
# Without it the actor's own default applies, and call() waits for as long as the run lasts.
RUN_TIMEOUT = timedelta(minutes=15)


def _text(value):
    return value.decode("utf-8") if isinstance(value, bytes) else value


def _run_input(scraper, url, limit, sort):
    if scraper == "with_replies":
        # One post per run, so this limit is per post. Replies count towards it.
        return {
            "directUrls": [url],
            "resultsLimit": limit,
            "includeNestedComments": True,
        }
    return {
        "postUrls": [url],
        "maxCommentsPerPost": limit,
        "sortOrder": sort or "recent",
    }


def _result(status, error=None, run=None, items=None):
    payload = {"status": status, "error": error, "run": run, "items": items or []}
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def fetch_post_comments(token, url, limit, scraper, sort):
    token, url, scraper, sort = _text(token), _text(url), _text(scraper), _text(sort)

    if scraper not in ACTORS:
        return _result("error", f"Unknown scraper: {scraper}")

    client = ApifyClient(token)

    try:
        run = client.actor(ACTORS[scraper]).call(
            run_input=_run_input(scraper, url, limit, sort), run_timeout=RUN_TIMEOUT
        )
    except Exception as e:
        logging.exception("Apify call failed for %s", url)
        return _result("error", f"Apify call failed: {e}")

    # call() returns None when it stops waiting before the run finishes.
    if run is None:
        return _result("error", "Apify run did not finish (no run returned).")

    run_json = run.model_dump(mode="json")

    # A run can come back FAILED / TIMED-OUT / ABORTED without raising.
    if run_json.get("status") != "SUCCEEDED":
        message = run_json.get("status_message") or "no status message"
        return _result(
            "error", f"Apify run {run_json.get('status')}: {message}", run_json
        )

    try:
        items = list(client.dataset(run_json["default_dataset_id"]).iterate_items())
    except Exception as e:
        logging.exception("Reading Apify dataset failed for %s", url)
        return _result("error", f"Reading Apify dataset failed: {e}", run_json)

    return _result("ok", run=run_json, items=items)
