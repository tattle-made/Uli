
import random


# implement using files,for annotator dict?
annotators_dict = {}

def check_availability(annotators,annotators_dict):

    """
    check availabity of annotators
    """

    for annotator in annotators:

        if annotator['current_posts'] <= annotator['max_post']:

            annotators_dict[annotator['id']] = 1 
        else:

            annotators_dict[annotators_dict['id']] = 0

    return annotators_dict


def pick_annotators(annotators,annotators_dict,count):

    """
    annotators_dict : dict with annotator id as key and availability (bool) as value,can expand with new 
                     incoming annotators

                    availability -
                    1 -> available
                    0 _> not available

    count : no. of annotator to allocate
    """
    annotators_dict = check_availability(annotators_dict)
    
    # check for every post,the availability of annotators
    for annotator,avail in annotators_dict.items():

        if not avail:

            # remove from annotators dict
            annotators_dict.pop(annotator)
            
    
    list_annotators = random.sample(annotators_dict.keys(),count)

    return list_annotators

def allocate(posts,annotators,config):

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


    """
    Pseudo Code

    1.Iterative

    N -> # of annotators

    for post in posts:

        if <post not alloted>:

            <pick a random value between 0 and 1>
            
            # k% posts 3 times

            if the value is less than k/100:

                post_count = 0

                # if not biased against annotator
                if post_count < 3:

                    for annotator in annotators:
                        
                        if annotator.current_posts < annotator.max_posts:

                            <allocate post to the annotator>
                            post_count += 1

            
            else
                <distribute it to one of the (N-3) annotators>
                   
            
    2. 


    """


    for post in posts:
        
        if not post['annotations'][0]['id']:

            p = random.uniform(0,1)

            # paramter 'K'
            if p < config.net_overlap/100:

                #annotator_count = 0

                # if annotator_count < 3:

                #     for annotator in annotators:

                #         if annotator['current_posts'] < annotator['max_post'] and annotator['language']==post['language']:

                #             post['annotations'][0]['id'] = annotator['id']
                #             post['annotations'][0]['status'] = 0    # pending status
                #             annotator['current_posts'] += 1
                #             annotator_count += 1

                list_annotators = pick_annotators(annotators,annotators_dict,3)

                for annotator in annotators:

                    if annotator['current_posts'] < annotator['max_post'] and annotator['language']==post['language']:

                        post['annotations'][0]['id'] = annotator['id']
                        post['annotations'][0]['status'] = 0    # pending status
                        annotator['current_posts'] += 1
                        annotator_count += 1


            else:
                pick_annotators(annotators,annotators_dict,1)




            
















