# import psycopg2 useful for pgsql
import pandas as pd
from sqlalchemy.engine import URL 
from sqlalchemy import create_engine 
import sqlalchemy
from sqlalchemy.sql import text
import os

dbUsername = os.environ['DB_USERNAME']
dbPassword = os.environ['DB_PASSWORD']
dbHost = os.environ['DB_HOST']
dbPort = os.environ['DB_PORT']

url = 'mysql://{}:{}@{}:{}/uli_prod'.format(dbUsername, dbPassword, dbHost, dbPort) #connect to the server
engine = sqlalchemy.create_engine(url, echo = True) 





# function to get number of users registered in a given interval of time

def num_users(start, end):

    sql_num_users = '''
    SELECT COUNT(id) FROM ogbv_plugin.users 
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL '{}' DAY) AND createdAt <= DATE_SUB(NOW(), INTERVAL '{}' DAY)
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
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL '{}' DAY) AND createdAt <= DATE_SUB(NOW(), INTERVAL '{}' DAY)
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
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL '{}' DAY) AND createdAt <= DATE_SUB(NOW(), INTERVAL '{}' DAY)
    GROUP BY userId
    ORDER BY COUNT(id) DESC
    LIMIT 10;


    '''.format(end, start)

    with engine.connect().execution_options(autocommit=True) as conn:
        query = conn.execute(text(sql_posts_users))         
    posts_per_user = pd.DataFrame(query.fetchall())
    conn.close()
    output_list = []
    for ind in posts_per_user.index:
        temp = []
        temp.append(str(posts_per_user['userid'][ind]))
        temp.append(int(posts_per_user['count'][ind]))
        output_list.append(temp)
        # output_dict[str(posts_per_user['userid'][ind])] = (posts_per_user['count'][ind])
    # print(output_list)
    # print(type(output_list))
    return output_list


# function to get weekly data, can be changed to get a desired range as required

def weekly_data():
    users_data = num_users(0,7)
    archived_data = num_archived(0,7)
    archivers_data = archivers_list(0,7)
    return users_data['count'][0], archived_data['count'][0], archivers_data