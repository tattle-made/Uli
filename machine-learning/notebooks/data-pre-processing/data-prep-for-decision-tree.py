import marimo

__generated_with = "0.24.0"
app = marimo.App()


@app.cell
def _():
    import pandas as pd

    return (pd,)


@app.cell
def _(pd):
    df_1 = pd.read_csv("uli_annotated_tweets/train_hi_l1.csv")
    df_2 = pd.read_csv("uli_annotated_tweets/test_hi_l1.csv", engine="python")

    print(df_1.shape)
    print(df_2.shape)

    df_output = pd.concat([df_1, df_2])
    print(df_output.shape)
    return (df_output,)


@app.cell
def _(df_output):
    df_output.to_csv("uli_annotated_tweets/decision_tree_data.csv", index=False)
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
