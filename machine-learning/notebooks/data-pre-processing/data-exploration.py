import marimo

__generated_with = "0.24.0"
app = marimo.App()


@app.cell
def _():
    import pandas as pd
    import marimo as mo

    return mo, pd


@app.cell
def _(pd):
    df_train = pd.read_csv("uli_annotated_tweets/train_hi_l1.csv")
    return (df_train,)


@app.cell
def _(pd):
    df_test = pd.read_csv("uli_annotated_tweets/test_hi_l1.csv", engine='python')
    return (df_test,)


@app.cell
def _():
    return


@app.cell
def _(df_test, df_train, pd):
    def transform_df(df):
        """
        Transforms the data for the finetuning script.

        Key Features : 
        - Aggregates the annotator labels into 1 by simple majority heuristic and labels teh column 'label'
        - Drops the 'key' column
        """
        df = df.copy()
        df = df.drop(columns=['key'])

        hi_cols = ['hi_a1', 'hi_a2', 'hi_a3', 'hi_a4', 'hi_a5']

        # Convert to numeric, coercing any string "None" or invalid values to NaN
        for col in hi_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        def majority_label(row):
            values = row[hi_cols].dropna()
            if len(values) == 0:
                return None
            counts = values.value_counts()
            return int(counts.idxmax())

        df['label'] = df.apply(majority_label, axis=1)
        df = df.drop(columns=hi_cols)

        return df

    df_train_transformed = transform_df(df_train)
    df_test_transformed = transform_df(df_test)

    print("Train shape:", df_train_transformed.shape)
    print("Test shape:", df_test_transformed.shape)
    print("\nTrain label distribution:\n", df_train_transformed['label'].value_counts(dropna=False))
    print("\nTest label distribution:\n", df_test_transformed['label'].value_counts(dropna=False))
    return df_test_transformed, df_train_transformed


@app.cell
def _(df_test_transformed):
    df_test_shuffled = df_test_transformed.sample(frac=1, random_state=42).reset_index(drop=True)

    mid = len(df_test_shuffled) // 2
    df_test_split = df_test_shuffled.iloc[:mid].reset_index(drop=True)
    df_val_split = df_test_shuffled.iloc[mid:].reset_index(drop=True)

    print("Split 1 shape:", df_test_split.shape)
    print("Split 2 shape:", df_val_split.shape)
    return df_test_split, df_val_split


@app.cell
def _(df_test_split, df_train_transformed, df_val_split):
    # Change order of columns to match the finetuning script

    df_train_output = df_train_transformed[["label", "text"]]
    df_test_output = df_test_split[["label", "text"]]
    df_val_output = df_val_split[["label", "text"]]
    return df_test_output, df_train_output, df_val_output


@app.cell
def _(df_test_output, df_train_output, df_val_output):
    df_train_output.to_csv('uli_annotated_tweets/hindi_train.csv', index=False)
    df_test_output.to_csv("uli_annotated_tweets/hindi_test.csv", index=False)
    df_val_output.to_csv("uli_annotated_tweets/hindi_val.csv", index=False)
    return


@app.cell
def _(df_train_output):
    df_train_output
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Combining into one file for decision tree
    """)
    return


@app.cell
def _(df_test_output, df_train_output, df_val_output, pd):
    df_dt_out = pd.concat([df_train_output, df_test_output, df_val_output])
    df_dt_out.to_csv("uli_annotated_tweets/decision_tree_data.csv", index=False)
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
