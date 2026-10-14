# /// script
# requires-python = ">=3.10"
# dependencies = ["openai"]
# ///
"""
Asks OpenAI to categorize the comments of a creator's sample posts.

Run from lib/python:
    export OPENAI_API_KEY=...
    uv run comment_classifier.py

For each post it saves the raw LLM response to
scraper_output/labs_p1/llm_response_<username>_<post code>.json and copies category + remark
into the creator's comments file, so the /labs/p1 UI shows them.
"""

import json
import os

from openai import OpenAI

MODEL = "gpt-4o-mini"
DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "scraper_output", "labs_p1"
)

USERNAME = "pavi212"
COMMENTS_FILE = f"comments_{USERNAME}.json"
POSTS = [
    "https://www.instagram.com/p/DUK4C5mk5Ux/",
    "https://www.instagram.com/p/DJ376DtymVB/",
]

PROMPT = """You are helping a content creator triage the comments on their Instagram post.
Put every comment into exactly one category:

- abusive: insults, harassment, slurs, hate, threats or demeaning remarks, aimed at the
  creator, another commenter, or a group of people. Includes sarcastic or coded abuse.
- worth_engaging: comments worth a reply from the creator: genuine questions, constructive
  criticism or corrections, thoughtful personal stories, suggestions for future content.
- neutral_spam: everything else: generic praise, emojis, tagging friends, off-topic chatter,
  arguments between other users, promotions and spam.

Each comment has a number `n`. Reply with JSON in exactly this shape, one entry per
comment, in the same order, copying `n`:
{"results": [{"n": 1, "category": "abusive|worth_engaging|neutral_spam", "remark": "one short sentence explaining why"}]}"""

client = OpenAI()

path = os.path.join(DATA_DIR, COMMENTS_FILE)
comments = json.load(open(path))

for i, post_url in enumerate(POSTS, start=1):
    post_code = post_url.rstrip("/").split("/")[-1]

    post_comments = [c for c in comments if c["post_url"] == post_url]
    print(f"Post {i}: sending {len(post_comments)} comments for {post_url}")

    # Long lists make the model stop early, so send 50 comments per request.
    # Comments are numbered 1..50 per batch: the model copies short numbers far more
    # reliably than 17-digit comment IDs. The numbers are mapped back to IDs below.
    answer = {"results": []}
    tokens = 0
    for start in range(0, len(post_comments), 50):
        batch = post_comments[start : start + 50]
        to_send = [{"n": k, "text": c["text"]} for k, c in enumerate(batch, start=1)]
        response = client.chat.completions.create(
            model=MODEL,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": PROMPT},
                {"role": "user", "content": json.dumps(to_send, ensure_ascii=False)},
            ],
        )
        for r in json.loads(response.choices[0].message.content)["results"]:
            if isinstance(r.get("n"), int) and 1 <= r["n"] <= len(batch):
                r["comment_id"] = batch[r["n"] - 1]["id"]
                answer["results"].append(r)
        tokens += response.usage.total_tokens

    # Save the full response so it can be shared as-is.
    with open(
        os.path.join(DATA_DIR, f"llm_response_{USERNAME}_{post_code}.json"), "w"
    ) as f:
        json.dump(
            {
                "username": USERNAME,
                "post_url": post_url,
                "model": MODEL,
                "prompt": PROMPT,
                "response": answer,
            },
            f,
            indent=2,
        )

    # Copy the results into the sample comments so the UI shows them.
    results = {r["comment_id"]: r for r in answer["results"]}
    for c in comments:
        if c["id"] in results:
            c["category"] = results[c["id"]]["category"]
            c["remark"] = results[c["id"]]["remark"]
    with open(path, "w") as f:
        json.dump(comments, f, indent=2, ensure_ascii=False)

    print(
        f"  got {len(results)} of {len(post_comments)} results, tokens used: {tokens}"
    )
