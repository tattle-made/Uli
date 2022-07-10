import os
from dotenv import load_dotenv
load_dotenv()

twitter_db_config = {
    "db_username"   : os.environ.get("TWITTER_DB_USERNAME"),
    "db_password"   : os.environ.get("TWITTER_DB_PASSWORD"),
    "db_name"       : os.environ.get("TWITTER_DB_NAME"),
    "db_collection" : os.environ.get("TWITTER_DB_COLLECTION")
}

instagram_db_config = {
    "db_username"   : os.environ.get("INSTAGRAM_DB_USERNAME"),
    "db_password"   : os.environ.get("INSTAGRAM_DB_PASSWORD"),
    "db_name"       : os.environ.get("INSTAGRAM_DB_NAME"),
    "db_collection" : os.environ.get("INSTAGRAM_DB_COLLECTION")
}