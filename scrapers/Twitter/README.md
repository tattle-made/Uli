# Introduction

This repository contains code for scraping publicly available data from targeted user handles,hashtags and keywords on Twitter https://twitter.com/

# Why are we scraping this data

For the project on detecting and responding to online gender based violence, we are collecting data from Twitter that can be annotated and used for detection models. See more project details here:https://tattle.co.in/products/ogbv/

# Scraping methodology

Open source library [twint](https://github.com/twintproject/twint/) is used for scraping,later on the images and videos are uploaded to aws
s3 buckets and finally the post meta-data along with s3-url is uploaded to mongo-db

# Run locally

1. Fork the Repository
2. Install required Python Packages `pip install requirements.txt`and follow the instructions in the [twint repo](https://github.com/twintproject/twint/) to install 
   twint library
4. Set up an AWS S3 bucket to store the scraped content (images, videos, text) and a MongoDB to store the scraped metadata 
   (timestamps, likes, tags )
4. Create a .env file in the same folder and save your Twitter MongoDB collection and S3 access credentials in the .env file. These should be in the following format
  
  ```
  TWITTER_DB_USERNAME   = <YOUR_MONGODB_USERNAME>
  TWITTER_DB_PASSWORD   = <YOUR_MONGODB_PASSWORD>
  TWITTER_DB_NAME       = <YOUR_MONGODB_NAME>
  TWITTER_DB_COLLECTION = <YOUR_MONGODB_COLLECTION>

  AWS_ACCESS_KEY_ID = <YOUR_AWS_ACCESS_KEY>
  AWS_SECRET_ACCESS_KEY_ID = <YOUR_AWS_SECRET_ACCESS_KEY>
  AWS_BUCKET = <YOUR_AWS_BUCKET>
  AWS_USERNAME = <YOUR_AWS_USER_NAME>
  ```
 5.Run the scraper as : `python dev_twitter_scraper.py -u <users list> -m <max posts to scrape> `

# Wiki 

https://github.com/tattle-made/OGBV/wiki/Twitter-Scraper


# Want to contribute to this repository?

We have a [guide](../Instagram/docs/contributing.md) for you.

# Licence
When you submit code changes, your submissions are understood to be under the same licence that covers the project - GPL-3. Feel free to contact the maintainers if that's a concern.
