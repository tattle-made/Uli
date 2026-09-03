from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report
import pandas as pd
import joblib

# Load data


df = pd.read_csv("./uli_annotated_tweets/decision_tree_data.csv")  # columns: "text", "label" (0/1)
df = df.dropna(subset=["label"])
texts = df["text"].tolist()
labels = df["label"].tolist()

# Train/val/test split
X_texts, X_test_texts, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=42, stratify=labels
)

# Load embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Compute embeddings
X_train_emb = embed_model.encode(X_texts, convert_to_numpy=True)
X_test_emb  = embed_model.encode(X_test_texts, convert_to_numpy=True)

# Train decision tree
clf = DecisionTreeClassifier(
    max_depth=None,
    random_state=42
)
clf.fit(X_train_emb, y_train)

# Evaluate
y_pred = clf.predict(X_test_emb)
print(classification_report(y_test, y_pred))

joblib.dump(clf, "dt_model.joblib")