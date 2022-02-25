from datetime import date
from gspread_formatting import *

def upload_to_spreadsheet(data,EMAIL,annotator_id):
    
    service = gspread.service_account()
    sheet_name = str(annotator_id) + str(date.today())
    sh = service.create(sheet_name)

    worksheets_count = len(list(sh.worksheets()))
    
    
    sh.share(EMAIL, perm_type='user', role='writer')
    worksheet_name = "worksheet" + str(worksheets_count)
    
    rows = data.shape[0]
    #cols = data.shape[1]
    
    worksheet = sh.add_worksheet(title=worksheet_name,rows=rows,cols=20)

    spread = Spread(sheet_name)

    spread.df_to_sheet(df=data,sheet=worksheet_name,index=False)
    
    validation_rule = DataValidationRule(
    BooleanCondition('ONE_OF_LIST', ['0', '1']),showCustomUi=True)
    
    validation_range = 'C2:E' + str(rows)
    set_data_validation_for_cell_range(worksheet,validation_range, validation_rule)

import warnings
warnings.filterwarnings('ignore')
import pandas as pd
import csv
import random
import numpy as np
import gspread
from gspread_pandas import Spread

def filter_by_annotator(x,annotator_id):
    
    """
    filter posts by the given input annotator id
    """
    return False if annotator_id not in x else True


def assign_availability(annotators,annotators_dict):

    """
    Assign initial availabity of annotators
    """
    
    for annotator in annotators:
        
        # is available
        if annotator['current_posts'] <= annotator['max_post']:
            annotators_dict[annotator['id']] = 1 

        # not available
        else:
            annotators_dict[annotator['id']] = 0
    
    return annotators_dict

def pick_annotators(annotators_dict,count,lang,annotators,Config):

    """
    Arg:
    annotators_dict : dict with annotator id as key and availability (bool) as value,can expand with new 
                     incoming annotators

                    availability -
                    1 -> available
                    0 -> not available

    count : no. of annotator to allocate

    lang : language of the post

    Return:
    list of annotators ids
    """
    
    assign_dict = annotators_dict.copy()
    
    #going for option 2: assign zero avail value to un-available annotators
    for annotator,avail in annotators_dict.items():
        
        # depends on the annotator id (sequence)   
        if (not avail) or (annotators[Config['ordering'][annotator]]['language']!= lang):
            
            # remove from annotators dict if not available or not same language as the post
            assign_dict.pop(annotator)
            
    # error handling for sample larger than population

    # send 
    try:
        list_annotators = random.sample(assign_dict.keys(),count)
    except:
        raise "Error allocating posts to annotators"

    return list_annotators

def fetch_tweets(num_posts,lang='hi'):
    
    data = pd.read_csv('twitter_data_jan6.csv')
    
    lang_groups = data.groupby(['Language'])
    
    lang_data = lang_groups.get_group(lang)
    
    lang_data = lang_data.sample(frac=1)
    
    return lang_data.head(num_posts)

def allocate(posts,annotators,Config):

    """
    Allocate posts to annotators following distribution criteria
    
    Args:
    
    posts : [
    {
        tweet,
        hashtags,
        timestamp,
        language
        annotations: [
        {
            id,
            status : pending | completed

            # pending -> assigned to the annotator,yet to be completed -> 0
            # completed -> assigned to the annator, annotation completed -> 1
        }
        ]
    }
    ]

    annotators: [
    {
        id,
        language,
        max_post,
        current_posts,# count of posts assigned
        overlap : # yet to be defined
    }
    ]
    
    config : {
    
        net_overlap #k value in the distribution criteria
    }

    """

    # Iterate through the posts and assign posts following the distribution criteria.
    # k% of the posts need to be annotated by 3 annotators. The rest of the posts (100-k)% will be annotated by (N-3) annotator.

    # initialize annotators availability

    annotators_dict = {}
    annotators_dict = assign_availability(annotators,annotators_dict)
    
    #print(annotators_dict)

    # create a csv with post id,tweet and annotator id
    csv_dict = []
    
    # iterate through posts and assign them if already not assigned
    print(f"No. of posts : {len(posts)}")
    
    for post in posts:
        
        temp_dict = {}
        
        if not post['annotations'][0]['id']:

            p = random.uniform(0,1)

            # paramter 'K'
            if p < Config['net_overlap']/100:
                
                list_annotators = pick_annotators(annotators_dict,3,post['language'],annotators,Config)
                
                temp_id_list = []
                temp_status_list = []

                for annotator in list_annotators:
                    
                    #check the language avail before and []
                    #check availablity can be done here [+]
                    
                    #allocate_helper(post,annotator)
                    temp_id_list.append(annotator)
                    temp_status_list.append(0) #status

                    post['annotations'][0]['id'] = annotator
                    post['annotations'][0]['status'] = 0    # pending annotation status
                    
                    ann_index = Config['ordering'][annotator]
                    
                    annotators[ann_index]['current_posts'] += 1
                    
                    # update annotators_dict by changing avail value of un-unavailable annotators to 0
                    if annotators[ann_index]['current_posts'] > annotators[ann_index]['max_post']:
                        annotators_dict[ann_index] = 0

                temp_dict['tweet_id'] = post['post_id']
                temp_dict['tweet'] = post['tweet']
                temp_dict['annotator'] = temp_id_list
                temp_dict['count'] = len(temp_id_list)
                
                #temp_dict['status'] = temp_status_list
    
            else:
                list_annotators = pick_annotators(annotators_dict,1,post['language'],annotators,Config)
             
                for annotator in list_annotators:
                    
                    post['annotations'][0]['id'] = annotator
                    post['annotations'][0]['status'] = 0    # pending annotation status
                    ann_index = Config['ordering'][annotator]
                   
                    annotators[ann_index]['current_posts'] += 1
                    if annotators[ann_index]['current_posts'] > annotators[ann_index]['max_post']:
                        annotators_dict[ann_index] = 0

                
                
                temp_dict['tweet_id'] = post['post_id']
                temp_dict['tweet'] = post['tweet']
                temp_dict['annotator'] = post['annotations'][0]['id']
                temp_dict['count'] = 1
               
        csv_dict.append(temp_dict)

    keys = csv_dict[0].keys()

    with open('allocation_hindi.csv', 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(csv_dict)


if __name__ == "__main__":
    
    config = {'net_overlap' : 20,'ordering' : {'denny_hi':0, 'kirti_hi':1,'div_hi':2,'seema_hi':3,'kherun_hi':4,
                                              'haseena_hi':5,'srishti_hi':6}}   
    """
    Fetch tweets from csv 
    """
    posts = fetch_tweets(num_posts=8000)
    hin_posts = [{'tweet': row[0],'post_id':row[1],'language':row[2],'annotations':[{'id' : [],'status':-1}]} for row in zip(posts['Tweet'],posts['Tweet ID'],posts['Language'])]
    
    hin_annotators = [{'id':'denny_hi','language':'hi','max_post':10000,'current_posts':0},
                  {'id':'kirti_hi','language':'hi','max_post':10000,'current_posts':0},
                  {'id':'div_hi','language':'hi','max_post':9000,'current_posts':0},
                  {'id':'seema_hi','language':'hi','max_post':8000,'current_posts':0},
                  {'id':'kherun_hi','language':'hi','max_post':7000,'current_posts':0},
                  {'id':'haseena_hi','language':'hi','max_post':7500,'current_posts':0},
                  {'id':'srishti_hi','language':'hi','max_post':7500,'current_posts':0}]
    
    allocate(hin_posts,hin_annotators,config)
    
    df_hin = pd.read_csv('allocation_hindi.csv')
    
    df_hin_k_posts = df_hin[df_hin['count']==3]
    
    df_hin_k_posts['annotator'] = df_hin_k_posts['annotator'].apply(eval)
    
    hin_annotator_ids = list(config['ordering'].keys())
    
    for _id in hin_annotator_ids:
        
        annotator_posts = df_hin_k_posts[df_hin_k_posts['annotator'].apply(filter_by_annotator,args=(_id,))]
        
        annotator_posts = annotator_posts.iloc[:,:-2]

        annotator_posts.columns = ['tweet_id','tweet_edited_text']
        annotator_posts.reset_index(inplace=True,drop=True)
        
        additional_fields = ['Is this post gendered abuse when not directed at a person of marginalized gender?'
         ,'Is the post gendered abuse even when directed at a person of marginalized gender?','Does this post contain explicit/ aggressive language?']
        
        print(annotator_posts.head())
        
        for field in additional_fields:

            annotator_posts[field] = 'NaN'   
        
        upload_to_spreadsheet(annotator_posts,'techtattle6@gmail.com',_id)