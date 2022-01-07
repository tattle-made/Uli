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
from collections import Counter

FOLDER = Path('./data/twitter/')

headers = {
    "User-Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Content-Type": "text/html",
}

# def initialize_s3():

#     """
#     Setup the s3 bucket and returns the aws-base-url,bucket-name ,aws-s3 object and aws-resource object
#     Args:
#         None
#     Returns:
#         aws base url,aws bucket,s3 bucket object,s3 resource object
#     """
    
#     aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
#     aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_ID")
#     aws_username = os.environ.get("AWS_USERNAME")
#     aws_bucket = os.environ.get("AWS_BUCKET")
#     s3_client = boto3.client("s3", aws_access_key_id = aws_access_key_id,
#                           aws_secret_access_key= aws_secret_access_key) 

#     s3_resource = boto3.resource('s3', aws_access_key_id = aws_access_key_id,
#                           aws_secret_access_key= aws_secret_access_key)

#     #print(list(s3_resource.buckets.all()))
#     #ogbv_bucket = s3_resource.Bucket(aws_bucket) #Find the list of files stored in the given bucket
#     #print(ogbv_bucket.objects.all())

#     return aws_username, aws_bucket, s3_client, s3_resource

# def upload_to_s3(s3,file,filename,bucket,content_type):

#     """
#     Upload the images/videos to s3-bucket
#     Args:
#         s3 (s3 client object) 
#         file (.jpg/.mp4) - file to upload
#         filename - filename to store an uploaded file on s3 (or) Key
#         bucket - aws s3 bucket name
#         content_type - type of the data


#     Returns:
#         None
#     """

#     # Implement Error Handling
#     with open(file,"rb") as data:
#         s3.upload_fileobj(Fileobj = data,
#                           Bucket = bucket,
#                           Key = filename,
#                           ExtraArgs = {'ContentType':content_type,
#                                        'ACL':'public-read'})

#         print(f"{file} successfully uploaded to s3")

# def get_s3_url(s3_client,aws_bucket,image_url):

#     """
#     Download the image/video from image_url,upload it to s3-bucket and get the s3-url of the uploaded image/video
#     Args:
#         #aws_bucket (str) - name of the s3 bucket
#         #key - filename stored on s3 bucket
#         image_url - image/video url of the image/video on twitter 

#     Returns:
#         object_url - s3 url of the uploaded image/video
#     """

#     s3_url = ""

#     # check if the image_url exists for the tweet
#     if image_url:

#         query = {"image_url": image_url}

#         # check if the image exists on MongdDB
#         if coll.find_one(query):
#             print("Image already exists on MongoDB")

#         else:
#             print("image url :",image_url)
            
#             key = str(uuid4())
#             filename = key + '.jpg'

#             # download the image from the url and store locally
#             r = requests.get(image_url[0],headers=headers)
#             image = Image.open(BytesIO(r.content))

#             images_path = FOLDER/'images'

#             if not images_path.exists():
#                 os.makedirs(images_path)

#             image.save(images_path/filename)
#             print("Image saved on local disk....")

#             upload_to_s3(s3_client,images_path/filename,key,aws_bucket,'image')

#             config = botocore.client.Config(region_name = 'ap-south-1',signature_version = botocore.UNSIGNED)
#             s3_url = boto3.client('s3', config=config).generate_presigned_url('get_object', ExpiresIn=0, Params={'Bucket': aws_bucket, 'Key': key})
#             print(s3_url)

#     return s3_url

# def count_docs(coll):

#     """
#     Count the no. of docs/posts in the mongodb collection
#     Args:
#         coll (str) - mongodb collection 
#     """

#     print("Count of posts : ")
#     print(coll.count_documents({}))

# def initialize_mongo(data_config):

#     """ 
#     Takes the MongoDB config objects of a Tattle service and returns the service's MongoDB collection
#     Args:
#         data_config (dict): A config dictionary imported from db_config 
#     Example:
#         from db_config import instagram_db_config
#         collection = initialize_mongo(instagram_db_config)
#     """

#     mongo_url = "mongodb+srv://"+ data_config["db_username"] + ":"+ data_config["db_password"]+"@tattle-data-fkpmg.mongodb.net/test?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"   
#     cli = MongoClient(mongo_url)
#     db = cli[data_config["db_name"]]
#     coll = db[data_config["db_collection"]]

#     # count the no of post in the collection
#     count_docs(coll)

#     return coll

# def upload_to_mongo(data,coll):

#     """
#     Upload posts metadata to mongodb
#     Args:
#         data (dict) : contains all the required fields
#         coll : upload to mongo-db collection 
#     Returns:
#         None
#     """

#     # check if the tweet/post already exists on mongo-db using tweet_id
#     query = {"tweet_id": data['tweet_id']}

#     if coll.find_one(query):
#         print("Tweet already exists on Mongodb")
#     else:
#         coll.insert_one(data)

from datetime import date, timedelta

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield end_date - timedelta(n)


def scraper_util(hashtag,handle,keyword,limit,until):

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

    
    
    replies = twint.Config()

    if hashtag:
        print("Hashtag")
        print(hashtag)
    "

    elif handle:   
        print("Handle")
        print(handle)
    
        replies.Until = until
        replies.Pandas = True
        replies.To = '@' + handle
        replies.Hide_output = True
        replies.Store_json = True
        replies.Output = until + handle + ".json"
        
        try:
            twint.run.Search(replies)
            #df = twint.storage.panda.Tweets_df
        except Exception as exc:
            print(f'{exc}')

    elif keyword:
        print("keyword")
        print(keyword)
        

def run_scraper(hashtags,handles,keywords,limit,until):

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
            scraper_util(hashtag,handles,keywords,limit,until)

    elif handles:
       
        handles = handles.split(',')
        for handle in handles:
            scraper_util(hashtags,handle,keywords,limit,until)
        
    elif keywords:

        #change_folder(FOLDER/'keywords')
        keywords = keywords.split(',')
        for keyword in keywords:
            scraper_util(hashtags,handles,keyword,limit,until)

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

    month_dict = {"January":(1,30),"February":(1,28),"March":(1,31),"April":(1,30),"May":(1,31),"June":(1,30),"July":(1,31),"August":(1,31),"September":(1,30),"October":(1,31),"November":(1,30),"December":(1,31)}
    
    
    if args.hashtags:

        hasha = '2020_' +args.hashtags
        new_folder = FOLDER/'hashtags'/hasha

    elif args.keywords:

        hasha = '202_' + args.keywords 
        new_folder = FOLDER/'keyw0rds'/hasha

    elif args.handles:

        hasha = '2020_' +args.handles
        new_folder =FOLDER/'replies'/hasha
    
    if not new_folder.exists():
                os.makedirs(new_folder)

    os.chdir(new_folder)

#     # if args.hashtags or args.handles or args.keywords:

#     #     if os.makedirs()

    for idx,month in enumerate(month_dict.values()):
        #print(month[0])
        start_date = date(2020,idx+1,month[0])
        end_date = date(2020,idx+1,month[1])
        
        for single_date in daterange(start_date, end_date):
            until = single_date.strftime("%Y-%m-%d")
            print(until)
            time.sleep(1)
            run_scraper(args.hashtags,args.handles,args.keywords,args.max,until)
            