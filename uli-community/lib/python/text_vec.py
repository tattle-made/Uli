from sentence_transformers import SentenceTransformer
import logging

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

def get_embedding(text: str) -> list:
    """
    Get the vector embedding for a given text.
    
    Args:
        text: The input text to get embedding for
        
    Returns:
        List of floats representing the text embedding
        
    Raises:
        RuntimeError: If text processing fails
    """
    try:
        logger.info(f"Processing text: {text}")
        model = _get_model()
        embedding = model.encode(text, show_progress_bar=False)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        raise RuntimeError(f"Failed to process text: {str(e)}")

if __name__ == "__main__":
    # Example usage
    test_text = "temp temp temp temp"
    try:
        result = get_embedding(test_text)
        print(f"Successfully processed text. Vector length: {len(result)}")
    except Exception as e:
        print(f"Error: {str(e)}")