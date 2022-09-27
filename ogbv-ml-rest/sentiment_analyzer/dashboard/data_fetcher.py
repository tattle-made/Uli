

import psycopg2
import pandas as pd
from sqlalchemy.engine import URL 
from sqlalchemy import create_engine 
import sqlalchemy
from sqlalchemy.sql import text

dbUsername = 'postgres'
dbPassword = 'admin'
dbHost = 'localhost'
dbPort = 9942

url = 'postgresql+psycopg2://{}:{}@{}:{}/uli'.format(dbUsername, dbPassword, dbHost, dbPort) #connect to the server
engine = sqlalchemy.create_engine(url) 





# function to get number of users registered in a given interval of time

def num_users(start, end):

    sql_num_users = '''

    SELECT COUNT(id) FROM ogbv_plugin.users 
    WHERE createdAt >= (NOW() - '{} DAY'::INTERVAL) AND createdAt <= (NOW() - '{} DAY'::INTERVAL)

    '''.format(end, start)


    with engine.connect().execution_options(autocommit=True) as conn:
        query = conn.execute(text(sql_num_users))         
    weekly_users = pd.DataFrame(query.fetchall())
    return weekly_users
    conn.close()
    # print('Number of users created this week: ' + str(weekly_users['count'][0]))
    

# function to get number of posts archived in a given interval of time

def num_archived(start, end):

    sql_num_posts = '''

    SELECT COUNT(id) FROM ogbv_plugin.posts
    WHERE createdAt >= (NOW() - '{} DAY'::INTERVAL) AND createdAt <= (NOW() - '{} DAY'::INTERVAL)

    '''.format(end, start)

    with engine.connect().execution_options(autocommit=True) as conn:
        query = conn.execute(text(sql_num_posts))         
    weekly_posts_archived = pd.DataFrame(query.fetchall())
    return weekly_posts_archived
    conn.close()
    #print('Number of posts archived in the interval: ' + str(weekly_posts_archived['count'][0]))


# function to get top archivers in a given interval of time

def archivers_list(start, end):

    sql_posts_users = '''

    Select userId, COUNT(id)
    FROM ogbv_plugin.posts
    WHERE createdAt >= (NOW() - '{} DAY'::INTERVAL) AND createdAt <= (NOW() - '{} DAY'::INTERVAL)
    GROUP BY userId
    ORDER BY COUNT(id) DESC
    LIMIT 10;


    '''.format(end, start)

    with engine.connect().execution_options(autocommit=True) as conn:
        query = conn.execute(text(sql_posts_users))         
    users_per_post = pd.DataFrame(query.fetchall())
    users_per_post = users_per_post.to_dict()
    return users_per_post
    conn.close()
    #print(users_per_post)


# function to get weekly data, can be changed to get a desired range as required

def weekly_data():
    users_data = num_users(0,300)
    archived_data = num_archived(0,300)
    archivers_data = archivers_list(0,300)
    return users_data['count'][0], archived_data['count'][0], archivers_data

