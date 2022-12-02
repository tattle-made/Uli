import snscrape.modules.twitter as sntwitter  #install snscrape in your local machine, works with python 3.10.5
import pandas as pd
import requests

# Creating list to append tweet data to
tweets_list2 = []
size = 2000 # Number of tweets you want to scrape
# Using TwitterSearchScraper to scrape data and append tweets to list
# Add the string that you want to look for in the double quotes in the function input
# This function will scrape the tweets between the dates given in the 'since' and 'until fields'. You can remove those to get tweets from as early as 2006
# The tweets will be ordered from latest to oldest
for i,tweet in enumerate(sntwitter.TwitterSearchScraper('"Hate her" since:2022-11-01 until:2022-11-20').get_items()):
    if i>(size-1):
        break
    tweets_list2.append([tweet.user.username , tweet.content])
    
# Creating a dataframe from the tweets list above
tweets_df2 = pd.DataFrame(tweets_list2, columns=['username', 'text'])
final_csv = []  
url = 'http://127.0.0.1:8081/predict' #URL where the model is deployed
hate_percent = 0 
for ind in tweets_df2.index:
    postvar = {'text' : tweets_df2['text'][ind]}
    postresult = requests.post(url, json  = postvar) # Making a POST request to the server
    resultjson = postresult.json()
    
    #print(resultjson['sentiment']) ## In case you need to look at the results
    final_csv.append([tweets_df2['text'][ind], resultjson['sentiment'], resultjson['confidence'], tweets_df2['username'][ind]])
    if resultjson['sentiment'] == 'Hate':
        hate_percent = hate_percent + 1 # Calculating the number of tweets that are labelled as hate

result_df = pd.DataFrame(final_csv, columns = ['Tweet', 'Sentiment', 'Confidence', 'Username'])

print(result_df)
    
result_df.to_csv(r'C:\Work\ExtensionData\keywords\keyword_hate_her_20-11-2022.csv', index = True) # Saving scraped tweets as a CSV
print('------------------\n')
print((hate_percent*100)/size)