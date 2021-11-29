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

            print(f"{file} successfully uploaded to s3")

    except Exception as exc:
        print(f'{exc}')

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
            print("Image already exists on MongoDB")

        else:
            print("image url :",image_url)
            
            key = str(uuid4())
            filename = key + '.jpg'

            # download the image from the url and store locally
            r = requests.get(image_url[0],headers=headers)
            try:

                image = Image.open(BytesIO(r.content))
            except Exception as esc:
                print(f'Error : {esc}')

            images_path = FOLDER/'images'

            if not images_path.exists():
                os.makedirs(images_path)

            try:
                image.save(images_path/filename)
            except Exception as esc:
                print(f'Error : {esc}')

            print("Image saved on local disk....")

            upload_to_s3(s3_client,images_path/filename,key,aws_bucket,'image')

            config = botocore.client.Config(region_name = 'ap-south-1',signature_version = botocore.UNSIGNED)
            s3_url = boto3.client('s3', config=config).generate_presigned_url('get_object', ExpiresIn=0, Params={'Bucket': aws_bucket, 'Key': key})
            print(s3_url)

    return s3_url

def count_docs(coll):

    """
    Count the no. of docs/posts in the mongodb collection
    Args:
        coll (str) - mongodb collection 
    """

    print("Count of posts : ")
    print(coll.count_documents({}))

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

from datetime import date, timedelta

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

# start_date = date(2020, 10, 2)
# end_date = date(2020, 10, 5)
# for single_date in daterange(start_date, end_date):
#     until = single_date.strftime("%Y-%m-%d")
#     print(type(until))
#     print(single_date.strftime("%Y-%m-%d"))

def scraper_util(hashtag,handle,keyword,limit):

    """
    Scraper utility func;contains all the configurations reqd for scraping
    Args:
        hashtag (str): hashtag to scrape
        handle  (str): user handle to scrape
        keyword (str): keyword to scrape
        limit   (int): no. of tweets to scrape
    Returns:
        None
    """


    timestr = time.strftime("%Y%m%d%H%M%S")

    c = twint.Config()
    c.Limit = limit
    if not limit:
        c.Limit = 100
    
    #c.Format = "ID {id}"
    c.Store_json = True
    c.Hide_output = True
    #c.Since = "2021-01-01"
    #c.Until = "2021-10-20"
    #c.Until = "2020-12-30"
    #c.Until = "2020-12-24"
    #c.Until = "2020-12-21"
    #c.Until = "2020-12-17"
    #c.Until = "2020-12-11"
    #c.Until  = "2020-12-06"
    #c.Until = "2020-12-02"
    #c.Since = "2020-11-25"
    #c.Until = "2020-10-07"
    c.Until = "2020-09-23"
    print("c.until")
    print(c.Until)


    if hashtag:
        print("Hashtag")
        print(hashtag)
        c.Show_hashtags = True
        c.Search = "#" + hashtag
        c.Output = timestr + hashtag + ".json"

    elif handle:   
        print("Handle")
        print(handle)
        c.Username = handle
        c.Output = timestr + handle + c.Until + ".json" 

    elif keyword:
        print("keyword")
        print(keyword)
        c.Show_hashtags = False
        c.Search  = keyword
        c.Output  = timestr + keyword + ".json"
    
    twint_util = twint.run.Search(c)

def run_scraper(hashtags,handles,keywords,limit):

    """
    Scraper function to scrape tweets based on hastags,handles,keywords
    Args:
        hastags

    """

    # Implement reading the search items from a file
    if hashtags:
        #change_folder(FOLDER/'hashtags')
        hashtags = hashtags.split(',')
        for hashtag in hashtags:
            scraper_util(hashtag,handles,keywords,limit)

    elif handles:
        #change_folder(FOLDER/'handles')
        handles = handles.split(',')
        for handle in handles:
            scraper_util(hashtags,handle,keywords,limit)
        
    elif keywords:
        #change_folder(FOLDER/'keywords')
        for keyword in keywords:
            scraper_util(hashtags,handles,keyword,limit)

def find_content_type(thumbnail_link):

    if thumbnail_link:
        content = thumbnail_link.split('/')[3]

        if content == "media":
            content_type = "image"

        elif content == "tweet_video_thumb":
            content_type = "gif"
        
        elif content == "ext_tw_video_thumb" or "amplify_video_thumb":
            content_type = "video"
        
        print(content)

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

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-t",
        "--hashtags",
        type=str
    )

    parser.add_argument(
        "-u",
        "--handles",
        type=str
    )

    parser.add_argument(
        "-k",
        "--keywords",
        type=str
    )
    
    parser.add_argument(
        "-m",
        "--max",
        type=str
    )

    args = parser.parse_args()

    start_date = date(2020, 9, 1)
    end_date = date(2020, 9, 30)

    # for single_date in daterange(start_date, end_date):
    #     until = single_date.strftime("%Y-%m-%d")
    #     print(until)
    #     time.sleep(1)
    #run_scraper(args.hashtags,args.handles,args.keywords,args.max)
    #run_scraper(args.hashtags,args.handles,args.keywords)

    aws_username,aws_bucket,s3_client,s3_resource = initialize_s3()

    coll = initialize_mongo(twitter_db_config)

    count_docs(coll)

    # #json_file = 'data/twitter/hashtags/20211021194333RheaChakraborty.json'

    PATH = os.getcwd()
    print(PATH)

    json_files = glob.glob(PATH + "/sansbarrier2020" + "/*.json",recursive=False)
    
    for json_file in json_files:
        print(json_file)
        #break
        
        print(f'Uploading the posts from {json_file} file')

        with open(json_file,'r') as f:
                
            posts = f.readlines()
            posts = [post.strip('\n') for post in posts]

            print(f'No. of posts uploading : {len(posts)}')

            mongodb_posts = []
            
            for post in posts:
                
                mongo_dict = {}
                post_dict  = json.loads(post)
                
                #if post_dict['photos']:
                
                mongo_dict['tweet_id'] = post_dict['id']
                mongo_dict['tweet'] = post_dict['tweet']
                mongo_dict['image_url'] = post_dict['photos']
                mongo_dict['s3_url'] = get_s3_url(s3_client,aws_bucket,post_dict['photos'])
                mongo_dict['tweet_url'] = post_dict['link']
                mongo_dict['user_id'] = post_dict['user_id']
                mongo_dict['timestamp_of_creation'] = post_dict['created_at']
                mongo_dict['language'] = post_dict['language']
                mongo_dict['reply'] = 1 if post_dict['reply_to'] else 0
                mongo_dict['repost'] = 1 if post_dict['retweet'] else 0  
                mongo_dict['timestamp_of_scraping'] = time.strftime("%Y%m%d%H%M%S")
                mongo_dict['type'] = 'handle'
                mongo_dict['search'] = 'sansbarrier'
                mongo_dict['content_type'] = find_content_type(post_dict['thumbnail'])
                print(mongo_dict)
                
                upload_to_mongo(mongo_dict,coll)
                
            count_docs(coll)
        
        