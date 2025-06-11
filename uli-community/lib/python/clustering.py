import logging
import tempfile
from typing import Dict, List, Union

import yaml
from feluda import Feluda
from feluda.models.media_factory import VideoFactory

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

        with tempfile.NamedTemporaryFile(suffix=".yml", mode="w", delete=True) as temp_file:
            yaml.dump(config, temp_file)
            temp_file.flush()
            
            _feluda_instance = Feluda(temp_file.name)
            _feluda_instance.setup()
    
    return _feluda_instance

# def get_clusters():
    