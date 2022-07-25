import snscrape.modules.twitter as sntwitter #install snscrape in your local machine, works with python 3.10.5
import pandas as pd
import requests

# Creating list to append tweet data to
tweets_list1 = []
size = 2000 # Number of tweets you want to scrape
# Using TwitterSearchScraper to scrape data and append tweets to list
# Add the username of the user whose tweets you want to scrape after the 'from' keyword in the function
# The tweets will be ordered from latest to oldest

for i,tweet in enumerate(sntwitter.TwitterSearchScraper('from:unwomenindia').get_items()):
    if i>(size-1):
        break
    tweets_list1.append([tweet.user.username , tweet.content])
    
# Creating a dataframe from the tweets list above
tweets_df1 = pd.DataFrame(tweets_list1, columns=['username', 'text'])
final_csv = []
url = 'https://ogbv-ml-rest.tattle.co.in/predict' # URL where the model is deployed
hate_percent = 0
for ind in tweets_df1.index:
    postvar = {'text' : tweets_df1['text'][ind]}
    postresult = requests.post(url, json  = postvar) # Making a POST request to the server
    resultjson = postresult.json()
    
    #print(resultjson['sentiment']) ## In case you need to look at the results
    final_csv.append([tweets_df1['text'][ind], resultjson['sentiment'], resultjson['confidence'], tweets_df1['username'][ind]])
    if resultjson['sentiment'] == 'Hate':
        hate_percent = hate_percent + 1 # Calculating the number of tweets that are labelled as hate

result_df = pd.DataFrame(final_csv, columns = ['Tweet', 'Sentiment', 'Confidence', 'Username'])

print(result_df)
    
result_df.to_csv(r'C:\Work\ExtensionData\users\un_women_india.csv', index = True) # Saving scraped tweets as a CSV
print('------------------\n')
print(hate_percent/size)