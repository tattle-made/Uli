### Posts Allocation to Annotators

#### Following is the sample dict of posts and annotators with corresponding attributes



```
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

config : {
    net_overlap -> k value
}

```

#### Distribution Criteria

 - k% of the posts need to be annotated by 3 random annotators. The rest of the posts (100-k)% will be annotated by 1 random annotator.




#### WorkFlow of the Script

-> Assign the k value (net_overlap) 

-> Fetch the posts from db

-> Update the posts acc. to the above dict format

-> Create an annotators dict to save the availability of annotators

