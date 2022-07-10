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
import botocore
import uuid

FOLDER  = './data/instagram/'

def scraper_util(userhandles,maxposts):

    """
    Takes a .txt file containing userhandles,max posts to scrape as input arguments and creates a json file 
    for a given user-handle containing all the required fields.

    Args:
        userhandles (.txt file) : contains the userhandles to scrape
        maxposts (int)  : no. of posts to scrape,if set to MAX,scrapes all the posts 

    Returns:
        None
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
    #ogbv_bucket = s3_resource.Bucket(aws_bucket) #Find the list of files stored in the given bucket
    #print(ogbv_bucket.objects.all())

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

    with open(file,"rb") as data:
        s3.upload_fileobj(Fileobj = data,
                          Bucket = bucket,
                          Key = filename,
                          ExtraArgs = {'ContentType':content_type,
                                       'ACL':'public-read'})

def count_s3_files(s3, bucket):

    """
    Count the no. of files in the s3 bucket
    
    Args:
        s3 - s3 client object
        bucket (str) - s3 bucket name
    Returns:
        file_count (int) - count of files
    """

    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket)
    file_count = 0
    for page in pages:
        for obj in page['Contents']:
            file_count += 1
    return file_count

def get_s3_url(aws_bucket,key):

    """
    Get the s3-url of the uploaded image/video
    Args:
        aws_bucket (str) - name of the s3 bucket
        key - filename stored on s3 bucket

    Returns:
        object_url - s3 url of the uploaded image/video
    """

    config = botocore.client.Config(region_name = 'ap-south-1',signature_version = botocore.UNSIGNED)
    object_url = boto3.client('s3', config=config).generate_presigned_url('get_object', ExpiresIn=0, Params={'Bucket': aws_bucket, 'Key': key})
    print(object_url)


def initialize_mongo(data_config):

    """ 
    Takes the MongoDB config objects of a Tattle service and returns the service's MongoDB collection
    Args:
        data_config (dict): A config dictionary imported from db_config 
    Example:
        from db_config import instagram_db_config
        collection = initialize_mongo(instagram_db_config)
    """

    mongo_url = "mongodb+srv://"+data_config["db_username"]+":"+data_config["db_password"]+"@tattle-data-fkpmg.mongodb.net/test?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"   
    cli = MongoClient(mongo_url)
    db = cli[data_config["db_name"]]
    coll = db[data_config["db_collection"]]
    print(coll.count_documents({}))
       


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
    
    #Add hashtags parser
    
    args = parser.parse_args()
    
    if not os.path.exists(FOLDER):
        os.makedirs(FOLDER)

    os.chdir(FOLDER)

    #Scrap Instagram posts of the given users
    scraper_util(args.userhandles,args.maxposts)
    
    #Initialize S3
    aws_username,aws_bucket,s3_client,s3_resource = initialize_s3()
    
    #List of files to upload

    #Upload images/videos to s3 bucket
    filename = str(uuid.uuid4())
    print(filename)
    upload_to_s3(s3_client,'./ig_data/4n.jpg',filename,aws_bucket,'image')
 
    #Fetch the urls of uploaded 
    get_s3_url(aws_bucket,filename)

    #Count the no. of files in the s3 bucket    
    print(count_s3_files(s3_client,aws_bucket))
    
    #Initialize Mongo
    initialize_mongo(instagram_db_config)
    
    """
    Upload to Mongo
    """

    #buckets_count = s3_client.list_buckets()
    #bucket_names = [i['Name'] for i in (buckets_count['Buckets'])]
    #print(bucket_names)
    #print((buckets_count['Buckets']))