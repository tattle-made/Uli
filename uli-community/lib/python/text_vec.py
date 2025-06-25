import logging

from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Singleton instance
_model_instance = None


def _get_model():
    global _model_instance
    if _model_instance is None:
        _model_instance = SentenceTransformer("krutrim-ai-labs/vyakyarth")
    return _model_instance


def get_embedding(text: str):
    if isinstance(text, bytes):
        text_str = text.decode("utf-8")
    else:
        text_str = text
    try:
        logger.info(f"Processing text: {text_str}")
        model = _get_model()
        embedding = model.encode(text_str, show_progress_bar=True)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        raise RuntimeError(f"Failed to process text: {str(e)}")
    
def decode_bytes(obj):
    if isinstance(obj, dict):
        return {decode_bytes(k): decode_bytes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [decode_bytes(i) for i in obj]
    elif isinstance(obj, bytes):
        return obj.decode("utf-8")
    else:
        return obj

def get_embeddings(items):
    """
    items: list of dicts, each with 'id' and 'label'
    Returns: list of dicts, each with 'id' and 'embedding'
    """
    items_decoded = decode_bytes(items)
    try:
        texts = [item['label'] for item in items_decoded]
        ids = [item['id'] for item in items_decoded]
        model = _get_model()
        embeddings = model.encode(texts, show_progress_bar=True)
        return [{"id": id_, "embedding": emb.tolist()} for id_, emb in zip(ids, embeddings)]
    except Exception as e:
        logger.error(f"Error processing batch: {str(e)}")
        raise RuntimeError(f"Failed to process batch: {str(e)}")


if __name__ == "__main__":
    # Example usage
    test_text = "temp temp temp temp"
    try:
        result = get_embedding(test_text)
        print(f"Successfully processed text. Vector length: {len(result)}")
    except Exception as e:
        print(f"Error: {str(e)}")
