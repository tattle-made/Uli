import argparse
import joblib
from sentence_transformers import SentenceTransformer

LABEL_NAMES = {0: "non-abusive", 1: "abusive"}


def load_model(model_path, embed_model_name="all-MiniLM-L6-v2"):
    clf = joblib.load(model_path)
    embed_model = SentenceTransformer(embed_model_name)
    return clf, embed_model


def classify(text, clf, embed_model):
    emb = embed_model.encode([text], convert_to_numpy=True)
    pred = clf.predict(emb)[0]
    probs = clf.predict_proba(emb)[0]
    return int(pred), probs.tolist()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Inference with decision tree abuse detection model")
    parser.add_argument("--model_path", type=str, default="dt_model.joblib")
    parser.add_argument("--embed_model", type=str, default="all-MiniLM-L6-v2")
    parser.add_argument("--text", type=str, default=None)
    args = parser.parse_args()

    clf, embed_model = load_model(args.model_path, args.embed_model)

    examples = [args.text] if args.text else [
        "यह एक सामान्य वाक्य है",
        "तुम बहुत बुरे इंसान हो",
        "what a bitch slut!",
        "are you a retard?"
    ]

    for text in examples:
        pred, probs = classify(text, clf, embed_model)
        print(f"Text   : {text}")
        print(f"Label  : {pred} ({LABEL_NAMES[pred]})")
        print(f"Probs  : non-abusive={probs[0]:.3f}, abusive={probs[1]:.3f}")
        print()
