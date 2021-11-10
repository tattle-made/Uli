
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
                <distribute it to (N-3) annotators>
                   
            
    2. 


    """

    # for post in posts:

    #     if not post['annotations'][0]['id']:




            
















