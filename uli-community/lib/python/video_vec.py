import tempfile

import yaml
from feluda import Feluda
from feluda.models.media_factory import VideoFactory


def get_avg_vec(file_path):
    if isinstance(file_path, bytes):
        file_path_str = file_path.decode("utf-8")
    else:
        file_path_str = file_path

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

    fd, config_path = tempfile.mkstemp(suffix=".yml", text=True)
    with open(config_path, "w") as f:
        yaml.dump(config, f)

    feluda = Feluda(config_path)
    feluda.setup()

    video_object = VideoFactory.make_from_url(file_path_str)
    operator = feluda.operators.get()["vid_vec_rep_clip"]
    video_vec = operator.run(video_object)
    avg_vec = next(vec for vec in video_vec if vec["is_avg"])
    return avg_vec["vid_vec"]


if __name__ == "__main__":
    file_path = "https://github.com/tattle-made/feluda_datasets/raw/main/feluda-sample-media/sample-cat-video.mp4"
    get_avg_vec(file_path)
