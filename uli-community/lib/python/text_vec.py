import logging

from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def initialize():
    global model
    logger.info("Loading Vyakyarth model...")
    model = SentenceTransformer("krutrim-ai-labs/vyakyarth")
    logger.info("Model loaded successfully.")

def decode_bytes( obj):
    if isinstance(obj, dict):
        return {decode_bytes(k): decode_bytes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [decode_bytes(i) for i in obj]
    elif isinstance(obj, bytes):
        return obj.decode("utf-8")
    else:
        return obj

def get_embedding(text: str):
    if isinstance(text, bytes):
        text_str = text.decode("utf-8")
    else:
        text_str = text
    try:
        logger.info(f"Processing text: {text_str}")
        embedding = model.encode(text_str, show_progress_bar=False)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        raise RuntimeError(f"Failed to process text: {str(e)}")


def get_embeddings(items):
    """
    items: list of dicts, each with 'id' and 'label'
    Returns: list of dicts, each with 'id' and 'embedding'
    """
    items_decoded = decode_bytes(items)
    try:
        texts = [item["label"] for item in items_decoded]
        ids = [item["id"] for item in items_decoded]
        embeddings = model.encode(texts, show_progress_bar=False)
        logger.info(f"Processed {len(items)} Text Words")
        return [
            {"id": id_, "embedding": emb.tolist()} for id_, emb in zip(ids, embeddings)
        ]
    except Exception as e:
        logger.error(f"Error processing batch: {str(e)}")
        raise RuntimeError(f"Failed to process batch: {str(e)}")


# For testing purposes
if __name__ == "__main__":
    try:
        test_text = "temp temp temp temp"
        result = get_embedding(test_text)
        print(f"Successfully processed text. Vector length: {len(result)}")

        test_batch = [
            {"id": 1, "label": "hello world"},
            {"id": 2, "label": "this is a test"},
        ]
        batch_result = get_embeddings(test_batch)
        print(f"Successfully processed batch. Result: {batch_result}")

    except Exception as e:
        print(f"Error: {str(e)}")
