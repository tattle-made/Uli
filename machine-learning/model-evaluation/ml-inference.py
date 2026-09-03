import argparse
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

LABEL_NAMES = {0: "non-abusive", 1: "abusive"}


def load_model(model_dir, base_checkpoint, use_cuda=False):
    tokenizer = AutoTokenizer.from_pretrained(base_checkpoint, use_fast=True)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    if use_cuda:
        model = model.cuda()
    model.eval()
    return tokenizer, model


def classify(text, tokenizer, model, max_length=512, use_cuda=False):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
    if use_cuda:
        inputs = {k: v.cuda() for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits
    pred = torch.argmax(logits, dim=-1).item()
    probs = torch.softmax(logits, dim=-1).squeeze().tolist()
    return pred, probs


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Inference with finetuned abuse detection model")
    parser.add_argument("--model_dir", type=str, required=True, help="Path to saved model (output_dir from finetune.py)")
    parser.add_argument("--base_checkpoint", type=str, required=True, help="Base HuggingFace checkpoint used during finetuning (e.g. xlm-roberta-base)")
    parser.add_argument("--text", type=str, default=None, help="Text to classify")
    parser.add_argument("--cuda", action="store_true", default=False)
    parser.add_argument("--max_length", type=int, default=512)
    args = parser.parse_args()

    tokenizer, model = load_model(args.model_dir, args.base_checkpoint, args.cuda)

    examples = [args.text] if args.text else [
        "यह एक सामान्य वाक्य है",
        "तुम बहुत बुरे इंसान हो",
        "अब तीन चीजें आपको कटी मिलेंगी  - 1-दीदी का प्लास्टर 2-साहब की दाढ़ी और 3-सेक्युलरों की लुल्ली 😏😏😏",
        "what a bitch slut!",
        "are you a retard?"
    ]

    for text in examples:
        pred, probs = classify(text, tokenizer, model, args.max_length, args.cuda)
        print(f"Text   : {text}")
        print(f"Label  : {pred} ({LABEL_NAMES[pred]})")
        print(f"Probs  : non-abusive={probs[0]:.3f}, abusive={probs[1]:.3f}")
        print()
