from ast import parse
from typing import Hashable
from requests.api import head
from dotenv import load_dotenv
load_dotenv()
import nest_asyncio
nest_asyncio.apply()
from pathlib import Path
from pymongo import MongoClient
import argparse
import twint
import time
import json
import glob
import os
import boto3
import botocore
import requests
from uuid import uuid4
from PIL import Image
from io import BytesIO
from db_config import twitter_db_config
import datetime
from tqdm import tqdm
import logging

FOLDER = Path('./data/twitter/')

headers = {
    "User-Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Content-Type": "text/html",
}

def initialize_s3():

    """
    Setup the s3 bucket and returns the aws-base-url,bucket-name ,aws-s3 object and aws-resource object
    Args:
        None
    Returns:
        aws base url,aws bucket,s3 bucket object,s3 resource object
    """
    
    aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_ID")
    aws_username = os.environ.get("AWS_USERNAME")
    aws_bucket = os.environ.get("AWS_BUCKET")
    s3_client = boto3.client("s3", aws_access_key_id = aws_access_key_id,
                          aws_secret_access_key= aws_secret_access_key) 

    s3_resource = boto3.resource('s3', aws_access_key_id = aws_access_key_id,
                          aws_secret_access_key= aws_secret_access_key)

    #print(list(s3_resource.buckets.all()))
    
    #print(ogbv_bucket.objects.all())
    

    #ogbv_bucket = s3_resource.Bucket(aws_bucket) #Find the list of files stored in the given bucket
    # Delete all files
    #ogbv_bucket.objects.delete()
    

    # List of files
    # allfiles = ogbv_bucket.objects.all()
    # for file in allfiles:
    #     print(file.key)

    return aws_username, aws_bucket, s3_client, s3_resource

def upload_to_s3(s3,file,filename,bucket,content_type):

    """
    Upload the images/videos to s3-bucket
    Args:
        s3 (s3 client object) 
        file (.jpg/.mp4) - file to upload
        filename - filename to store an uploaded file on s3 (or) Key
        bucket - aws s3 bucket name
        content_type - type of the data


    Returns:
        None
    """

    # Implement Error Handling
    try:

        with open(file,"rb") as data:
            s3.upload_fileobj(Fileobj = data,
                            Bucket = bucket,
                            Key = filename,
                            ExtraArgs = {'ContentType':content_type,
                                        'ACL':'public-read'})

            #print(f"{file} successfully uploaded to s3")
            logging.info(f"{file} successfully uploaded to s3")

    except Exception as exc:
        print(f'{exc}')
        logging.info(f'{exc}')

def get_s3_url(s3_client,aws_bucket,image_url):

    """
    Download the image/video from image_url,upload it to s3-bucket and get the s3-url of the uploaded image/video
    Args:
        #aws_bucket (str) - name of the s3 bucket
        #key - filename stored on s3 bucket
        image_url - image/video url of the image/video on twitter 

    Returns:
        object_url - s3 url of the uploaded image/video
    """

    s3_url = ""

    # check if the image_url exists for the tweet
    if image_url:

        query = {"image_url": image_url}

        # check if the image exists on MongdDB
        if coll.find_one(query):
            #print("Image already exists on MongoDB")
            logging.info("Image already exists on MongoDB")

            return -1

        else:
            #print("image url :",image_url)
            logging.info(f"image url : {image_url}")
            key = str(uuid4())
            filename = key + '.jpg'

            # download the image from the url and store locally
            r = requests.get(image_url[0],headers=headers)
            try:

                image = Image.open(BytesIO(r.content))
            except Exception as esc:
                logging.info(f'Error : {esc}')

            images_path = FOLDER/'images'

            if not images_path.exists():
                os.makedirs(images_path)

            try:
                image.save(images_path/filename)
            except Exception as esc:
                logging.info(f'Error : {esc}')

            #print("Image saved on local disk....")
            logging.info("Image saved on local disk....")
            upload_to_s3(s3_client,images_path/filename,key,aws_bucket,'image')

            config = botocore.client.Config(region_name = 'ap-south-1',signature_version = botocore.UNSIGNED)
            s3_url = boto3.client('s3', config=config).generate_presigned_url('get_object', ExpiresIn=0, Params={'Bucket': aws_bucket, 'Key': key})
            #print(s3_url)
            logging.info(f"s3_url : {s3_url}")

    return s3_url

def count_docs(coll):

    """
    Count the no. of docs/posts in the mongodb collection
    Args:
        coll (str) - mongodb collection 
    """

    print("Count of posts : ")
    print(coll.count_documents({}))
    logging.info(f"Count of posts : {coll.count_documents({})}")

def initialize_mongo(data_config):

    """ 
    Takes the MongoDB config objects of a Tattle service and returns the service's MongoDB collection
    Args:
        data_config (dict): A config dictionary imported from db_config 
    Example:
        from db_config import instagram_db_config
        collection = initialize_mongo(instagram_db_config)
    """

    mongo_url = "mongodb+srv://"+ data_config["db_username"] + ":"+ data_config["db_password"]+"@tattle-data-fkpmg.mongodb.net/test?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"   
    cli = MongoClient(mongo_url)
    db = cli[data_config["db_name"]]
    coll = db[data_config["db_collection"]]

    # count the no of post in the collection
    count_docs(coll)
    
    #coll.update_many({},{"$unset": {"retweet": ""}})
    #coll.delete_many({})

    #cursor = coll.find({})
    # print("cursor")
    # print(cursor)
    # for document in cursor:
    #     print("krey") 
    #     print(document.keys())  # print all fields of this document. 
    
    return coll

def upload_to_mongo(data,coll):

    """
    Upload posts metadata to mongodb
    Args:
        data (dict) : contains all the required fields
        coll : upload to mongo-db collection 
    Returns:
        None
    """

    # check if the tweet/post already exists on mongo-db using tweet_id
    query = {"tweet_id": data['tweet_id']}

    if coll.find_one(query):
        print("Tweet already exists on Mongodb")
        logging.info("Tweet already exists on Mongodb")

        # coll.update_one(
        #     query,
        #     {
        #         query,
        #         ({"_id": b["_id"]}, {"$set": {"geolocCountry": myGeolocCountry}})

        #     }
        # )

        # coll.update_one(query,
        # {"$set": {"report",data['repost']}}
        # )

        # print("Added repost field")

    else:
        coll.insert_one(data)

def find_content_type(thumbnail_link):

    if thumbnail_link:
        content = thumbnail_link.split('/')[3]

        if content == "media":
            content_type = "image"

        elif content == "tweet_video_thumb":
            content_type = "gif"
        
        elif content == "ext_tw_video_thumb" or "amplify_video_thumb":
            content_type = "video"
        
        logging.info(content)
        
    else:
        content_type = "text"

    return content_type

def change_folder(FOLDER):

    """
    Create dir(if doesn't exist) and change to that dir
    Args:
        FOLDER (Path Object) - folder to create 
    """

    #if not os.path.exists(FOLDER):
    if not FOLDER.exists():
        os.makedirs(FOLDER)

    # implement error handling
    os.chdir(FOLDER)

if __name__ == "__main__":

    #root_logger = logging.getLogger()

    #logger1 = logging.FileHandl
    logging.basicConfig(filename='twitterdatauploader.log', level=logging.INFO)
    
    #startnote =  'Scraping started ' + str(time.strftime("%Y%m%d%H%M%S")) 
    #logging.info(startnote)

    aws_username,aws_bucket,s3_client,s3_resource = initialize_s3()
    logging.info("S3 Initialized")

    coll = initialize_mongo(twitter_db_config)
    logging.info("Mongo Initialized")

    count_docs(coll)

    PATH = os.getcwd()
    print(PATH)
    logging.info(PATH)

    #json_files = glob.glob(PATH + "/data/twitter/hashtags/14_முட்டாஉபி" + "/*.json",recursive=False)    
    #json_files = glob.glob(PATH + "/data/twitter/keyw0rds/2021_kumarikumari333" + "/*.json",recursive=False)
    #json_files = glob.glob(PATH + "/data/twitter/handles/2021_aartichabria" + "/*.json",recursive=False)
    #json_files = glob.glob(PATH + "/data/twitter/replies/**/" + "/*.json",recursive=False)
    json_files = glob.glob(PATH + "/data/twitter/replies_influencers" + "/*.json",recursive=False)

    for json_file in tqdm((json_files)):
        
        #print(f'Uploading the posts from {json_file} file')
        logging.info(f'Uploading the posts from {json_file} file')

        try:

            with open(json_file,'r') as f:
                    
                posts = f.readlines()
                posts = [post.strip('\n') for post in posts]

                len_posts = len(posts)

                print(f'No. of posts uploading : {len_posts}')
                logging.info(f'No. of posts uploading : {len_posts}')

                mongodb_posts = []
                
                search_note = json_file.split('/')[-1][10:-5]
                print(search_note)
                with open('searchterms.txt','a') as txt:
                        txt.write(search_note)
                        txt.write("\n")

                for idx,post in enumerate(posts):
                    
                    mongo_dict = {}
                    post_dict  = json.loads(post)

                    mongo_dict['tweet_id'] = post_dict['id']
                    mongo_dict['tweet'] = post_dict['tweet']
                    mongo_dict['image_url'] = post_dict['photos']
                    
                    s3_status = get_s3_url(s3_client,aws_bucket,post_dict['photos'])

                    if s3_status==-1:
                        print("image already uploaded")
                        #continue
                    else:
                        mongo_dict['s3_url'] = s3_status
                        
                    mongo_dict['tweet_url'] = post_dict['link']
                    mongo_dict['user_id'] = post_dict['user_id']
                    mongo_dict['timestamp_of_creation'] = post_dict['created_at']
                    mongo_dict['language'] = post_dict['language']
                    mongo_dict['reply'] = post_dict['reply_to'] 
                    mongo_dict['repost'] = post_dict['retweet']  

                    mongo_dict['timestamp_of_scraping'] = time.strftime("%Y%m%d%H%M%S")
                    mongo_dict['content_type'] = find_content_type(post_dict['thumbnail'])

                    # #latest
                    mongo_dict['conversation_id'] = post_dict['conversation_id']
                    mongo_dict['date_created'] = post_dict['date']
                    mongo_dict['time_created'] = post_dict['time']
                    mongo_dict['timezone'] = post_dict['timezone']
                    mongo_dict['username'] = post_dict['username']
                    mongo_dict['name'] = post_dict['name']
                    mongo_dict['place'] = post_dict['place']
                    mongo_dict['mentions'] = post_dict['mentions']
                    mongo_dict['urls'] = post_dict['urls']
                    mongo_dict['replies_count'] = post_dict['replies_count']
                    mongo_dict['retweets_count'] = post_dict['retweets_count']
                    mongo_dict['likes_count'] = post_dict['likes_count']
                    mongo_dict['hashtags'] = post_dict['hashtags']
                    mongo_dict['quote_url'] = post_dict['quote_url']
                    mongo_dict['near'] = post_dict['near']
                    mongo_dict['video'] = post_dict['video']
                    mongo_dict['geo'] = post_dict['geo']
                    mongo_dict['source'] = post_dict['source']
                    mongo_dict['user_rt_id'] = post_dict['user_rt_id']
                    mongo_dict['user_rt'] = post_dict['user_rt']
                    mongo_dict['retweet_id'] = post_dict['retweet_id']
                    mongo_dict['retweet_date'] = post_dict['retweet_date']
                    mongo_dict['translate'] = post_dict['translate']
                    mongo_dict['trans_src'] = post_dict['trans_src']
                    mongo_dict['trans_dest'] = post_dict['trans_dest']
                    
                    # #update
                    # #mongo_dict['type'] = 'hashtag'
                    # #mongo_dict['type'] = 'keyword'

                    mongo_dict['type'] = 'reply'
                    mongo_dict['search'] = json_file.split('/')[-1][10:-5]
                    
                    logging.info(f"Search : {mongo_dict['search']}")
                    post_count_note = str(idx) + "/" + str(len_posts)
                    logging.info(f"Post : {post_count_note}")
                    logging.info(f'{mongo_dict}')
                                            
                    upload_to_mongo(mongo_dict,coll)
                    
                count_docs(coll)
        
        except Exception as exc:
            logging.info(exc)