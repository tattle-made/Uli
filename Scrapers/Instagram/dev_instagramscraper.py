import time
import argparse
import instagram_scraper as insta
import subprocess
import json
from dotenv import load_dotenv
load_dotenv()
import os
import boto3
from pymongo import MongoClient
from db_config import twitter_db_config,instagram_db_config
import glob

def scraper_util(userhandles,maxposts):

    """
    Args:
        userhandles : .txt file containing the userhandles to scrape
        maxposts    : no. of posts to scrape,if set to MAX,scrapes all the posts 

    Returns:
        creates a .json file for a given userhandle containing all the required fields

    """

    if maxposts=="MAX":
        subprocess.run(["instagram-scraper","-f",userhandles,"--media-metadata","--media-types","none"])
    else:
        subprocess.run(["instagram-scraper","-f",userhandles,"-m",maxposts,"--media-metadata","--media-types","none"])

    time.sleep(1)

    with open(userhandles,'r') as users_file:

        users  = users_file.readlines()
        #print(users[0].strip('\n'))

        for user in users:
            print(user)
    
def initialize_mongo(data_config):

    """ 
    Takes the MongoDB config objects of a Tattle service and returns the service's MongoDB collection.
    Args:
        service (dict): A config dictionary imported from db_config 
    Example:
        from db_config import sharechat_db_config
        collection = initialize_mongo(sharechat_db_config)
    """

    mongo_url = "mongodb+srv://"+data_config["db_username"]+":"+data_config["db_password"]+"@tattle-data-fkpmg.mongodb.net/test?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"   
    cli = MongoClient(mongo_url)
    db = cli[data_config["db_name"]]
    coll = db[data_config["db_collection"]]
    print(coll.count_documents({}))
       

def initialize_s3():

    """
    Setup the s3 bucket and returns the aws-base-url,bucket-name and s3 object
    Args:
        None
    Returns:
        aws base url,aws bucket and s3 bucket object
    """
    
    aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_ID")
    aws_username = os.environ.get("AWS_USERNAME")
    aws_bucket = os.environ.get("AWS_BUCKET")
    s3_client = boto3.client("s3", aws_access_key_id = aws_access_key_id,
                          aws_secret_access_key= aws_secret_access_key) 

    s3_resource = boto3.resource('s3', aws_access_key_id = aws_access_key_id,
                          aws_secret_access_key= aws_secret_access_key)
    #print(list(resource.buckets.all()))
    
    ogbv_bucket = s3_resource.Bucket(aws_bucket) #Find the list of files stored in the given bucket
    #print(ogbv_bucket.objects.all())

    return aws_username, aws_bucket, s3_client,s3_resource

def upload_files_to_s3(s3_client,file_name,bucket,object_name=None,args=None):

    """
    Upload the images/videos to s3-bucket
    Args:

    Returns:

    
    """

    if object_name is None:
        object_name = file_name
    
    response = s3_client.upload_file(Filename=file_name,Bucket=bucket,Key=object_name,ExtraArgs = args)
    print(response)

if __name__ == "__main__":

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-u",
        "--userhandles",    
    )
    
    parser.add_argument(
        "-m",
        "--maxposts"
    )
    
    args = parser.parse_args()
    
    #scraper_util(args.userhandles,args.maxposts)
    #initialize_mongo(twitter_db_config)
    #initialize_mongo(instagram_db_config)

    aws_username,aws_bucket,s3_client,s3_resource = initialize_s3()

    #buckets_count = s3_client.list_buckets()
    #bucket_names = [i['Name'] for i in (buckets_count['Buckets'])]
    #print(bucket_names)
    #print((buckets_count['Buckets']))


    """
    Upload files to s3 bucket
    """
    
    upload_files_to_s3(s3_client,'1n.jpg',aws_bucket,args={'ACL':'public-read'})