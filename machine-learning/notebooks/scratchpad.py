import marimo

__generated_with = "0.24.0"
app = marimo.App()


@app.cell
def _():
    import pandas as pd
    import marimo as mo

    return (mo,)


@app.cell
def _():
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

    return AutoModelForSequenceClassification, AutoTokenizer, pipeline


@app.cell
def _(AutoModelForSequenceClassification, AutoTokenizer, pipeline):
    # Load the model and tokenizer from Hugging Face
    MODEL_NAME = "tattle-admin/july22-xlmtwtroberta-da-multi"

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

    classifier = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        return_all_scores=True
    )
    return (classifier,)


@app.cell
def _(mo):
    text_input = mo.ui.text_area(
        label="Enter text to classify",
        placeholder="Type or paste text here...",
        full_width=True,
        value="This is a sample sentence to classify."
    )

    run_btn = mo.ui.run_button(label="🔍 Run Classification", kind="neutral")

    mo.vstack([text_input, run_btn])
    return run_btn, text_input


@app.cell
def _(classifier, mo, run_btn, text_input):
    mo.stop(not run_btn.value, mo.md("_Enter text above and click **Run Classification** to get predictions._"))

    input_text = text_input.value.strip()
    mo.stop(not input_text, mo.callout(mo.md("⚠️ Please enter some text before running."), kind="warn"))

    result = classifier(input_text)[0]
    print(result)


    # Build a results display
    rows = [
        mo.hstack([
            mo.md(f"**{result['label']}**"),
            mo.md(f"`{result['score']:.4f}` ({result['score']*100:.1f}%)")
        ], justify="space-between")
    ]

    rows
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
