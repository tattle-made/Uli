import logging
import random
import tempfile
from typing import Any, Dict, List

import yaml
from feluda import Feluda

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Singleton instance
_feluda_instance = None


def _get_feluda():
    global _feluda_instance
    if _feluda_instance is None:
        config = {
            "operators": {
                "label": "Operators",
                "parameters": [
                    {
                        "name": "Cluster Embeddings",
                        "type": "cluster_embeddings",
                    }
                ],
            }
        }

        with tempfile.NamedTemporaryFile(
            suffix=".yml", mode="w", delete=True
        ) as temp_file:
            yaml.dump(config, temp_file)
            temp_file.flush()

            _feluda_instance = Feluda(temp_file.name)
            _feluda_instance.setup()

    return _feluda_instance


def decode_bytes(obj):
    if isinstance(obj, dict):
        return {decode_bytes(k): decode_bytes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [decode_bytes(i) for i in obj]
    elif isinstance(obj, bytes):
        return obj.decode("utf-8")
    else:
        return obj


def get_clusters(operator_parameters: List[Dict[str, Any]]) -> Any:
    """
    Run clustering on a list of embedding payloads using Feluda's cluster_embeddings operator.

    Args:
        operator_parameters: A list of dictionaries, each with:
            - "payload": a dict containing metadata like id
            - "embedding": a list of floats representing the vector

    Returns:
        A dictionary containing clustering results.
    """
    if not operator_parameters:
        raise ValueError("No operator parameters provided for clustering")

    try:
        operator_parameters = decode_bytes(operator_parameters)

        feluda = _get_feluda()
        cluster_operator = feluda.operators.get().get("cluster_embeddings")

        if not cluster_operator:
            raise RuntimeError("Cluster operator 'cluster_embeddings' not found")

        logger.info(f"Running clustering on {len(operator_parameters)} embeddings...")

        result = cluster_operator.run(
            operator_parameters, n_clusters=None, modality="video"
        )
        logger.info("Clustering completed successfully.")
        return result

    except Exception as e:
        logger.error(f"Error during clustering: {str(e)}")
        raise RuntimeError(f"Clustering failed: {str(e)}")


if __name__ == "__main__":
    # Generate dummy embedding data
    def generate_dummy_embedding(dim: int = 512) -> List[float]:
        return [random.uniform(-1, 1) for _ in range(dim)]

    dummy_data = [
        {"payload": {"id": f"video_{i}"}, "embedding": generate_dummy_embedding()}
        for i in range(10)
    ]

    try:
        clusters = get_clusters(dummy_data)
        print("Cluster Results:")
        print(clusters)
    except Exception as e:
        print(f"Error while clustering: {str(e)}")
