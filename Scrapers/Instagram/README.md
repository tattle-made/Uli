# Introduction

This repository contains code for scraping publicly available data from targeted user accounts on Instagram https://instagram.com/

# Why are we scraping this data

The goal is create a tool to clean up the sexist toxicity online lies with the social media platforms and create an alternative content moderation system

# Scraping methodology

Open source library [instagram-scraper](https://github.com/arc298/instagram-scraper) is used for scraping,later on the images and videos are uploaded to aws
s3 buckets and finally the post meta-data along with s3-url is uploaded to mongo-db

# Run locally

