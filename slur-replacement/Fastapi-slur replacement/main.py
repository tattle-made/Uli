from fastapi import FastAPI
from pydantic import BaseModel

from slur_replacement import slur_replacement_slurs

class GetTweetRequest(BaseModel):
    tweet: str

class SlurReplaceResponse(BaseModel):
    replaced_tweet: str

app = FastAPI()

@app.post('/slur_replace',response_model=SlurReplaceResponse)
def slur_replace(request: GetTweetRequest):

    replaced_tweet = slur_replacement_slurs(tweet=request.tweet)

    return SlurReplaceResponse(
        replaced_tweet = str(replaced_tweet)
    )

# if __name__ == "__main__":

#     uvicorn.run("main:app",port=80,reload=True)