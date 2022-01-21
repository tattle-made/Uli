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
import logging
import threading

FOLDER = Path('./data/twitter/')

headers = {
    "User-Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Content-Type": "text/html",
}


from datetime import date, timedelta

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield end_date - timedelta(n)


def scraper_util(hashtag,handle,keyword,limit,until,since):

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
    

    elif handle:   
        print("Handle")
        print(handle)


        replies.Limit = limit
        
        replies.Until = until
        replies.since = since
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
        

def run_scraper(hashtags,handles,keywords,limit,until,since):

    """
    Scraper function to scrape tweets based on hastags,handles,keywords
    Args:
        hastags

    """

    # Implement reading the search items from a file
    if hashtags:

        hashtags = hashtags.split(',')
        for hashtag in hashtags:
            scraper_util(hashtag,handles,keywords,limit,until)

    elif handles:
       
        handles = handles.split(',')
        for handle in handles:
            scraper_util(hashtags,handle,keywords,limit,until,since)
            
    elif keywords:

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

    logging.basicConfig(filename='twitterrepliestoinfluencers21.log', level=logging.INFO)
    startnote =  'Scraping started ' + str(time.strftime("%Y%m%d%H%M%S")) 
    logging.info(startnote)

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

    parser.add_argument(
        "--until",
        type=str
    )

    parser.add_argument(
        "--since",
        type=str
    )

    args = parser.parse_args()

    #month_dict = {"January":(1,30),"February":(1,28),"March":(1,31),"April":(1,30),"May":(1,31),"June":(1,30),"July":(1,31),"August":(1,31),"September":(1,30),"October":(1,31),"November":(1,30),"December":(1,31)}
    
    if args.hashtags:

        pass
        # hasha = '2020_' +args.hashtags
        # new_folder = FOLDER/'hashtags'/hasha

    elif args.keywords:

        pass
        # hasha = '2020_' + args.keywords 
        # new_folder = FOLDER/'keyw0rds'/hasha

    elif args.handles:

        with open(args.handles,'r') as txt:

            handles_list = txt.readlines()

            new_folder = FOLDER/'replies_influencers'
            if not new_folder.exists():
                    os.makedirs(new_folder)

            os.chdir(new_folder)

            for handle in handles_list:
                handle = handle.strip('\n')
                #print(handle)
                scrap_note = "Scraping : " + handle
                logging.info(f'{scrap_note}')

                
                t = threading.Thread(target=run_scraper,args=(args.hashtags,handle,args.keywords,args.max,args.until,args.since,))

                t.start()
                
                PATH = os.getcwd()
                print(PATH)
                end_note = 'Scraping done : ' + str(time.strftime("%Y%m%d%H%M%S"))  + handle 
                logging.info(f'{end_note}')

            end_note = 'Final Scraping done : ' + str(time.strftime("%Y%m%d%H%M%S"))  + handle 
            logging.info(f'{end_note}')    

                #t.join()
                #time.sleep(5)