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
                        "name": "video vector",
                        "type": "vid_vec_rep_clip",
                        "parameters": {"index_name": "video"},
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

def get_avg_vec(file_path: Union[str, bytes]) -> List[float]:
    """
    Get the average vector representation of a video file.
    
    Args:
        file_path: Path to the video file or URL as string or bytes
        
    Returns:
        List of floats representing the average vector
        
    Raises:
        ValueError: If the file path is invalid
        RuntimeError: If video processing fails
    """
    try:
        if isinstance(file_path, bytes):
            file_path_str = file_path.decode("utf-8")
        else:
            file_path_str = file_path

        logger.info(f"Processing video from path: {file_path_str}")

        feluda = _get_feluda()
        video_object = VideoFactory.make_from_url(file_path_str)
        operator = feluda.operators.get()["vid_vec_rep_clip"]
        video_vec = operator.run(video_object)
        
        avg_vec = next((vec for vec in video_vec if vec["is_avg"]), None)
        if not avg_vec:
            raise RuntimeError("No average vector found in video processing results")
            
        return avg_vec["vid_vec"]
        
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise RuntimeError(f"Failed to process video: {str(e)}")

if __name__ == "__main__":
    # Example usage
    file_path = "https://github.com/tattle-made/feluda_datasets/raw/main/feluda-sample-media/sample-cat-video.mp4"
    try:
        result = get_avg_vec(file_path)
        print(f"Successfully processed video. Vector length: {len(result)}")
    except Exception as e:
        print(f"Error: {str(e)}")
