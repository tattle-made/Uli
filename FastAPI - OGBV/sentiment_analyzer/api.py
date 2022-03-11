from typing import Dict

from fastapi import Depends, FastAPI
from pydantic import BaseModel

from .classifier.model import Model, get_model

app = FastAPI()

class OGBVRequest(BaseModel):
    text: str

# class OGBVResponse(BaseModel):
#     probabilities: Dict[str, float]
#     sentiment: str
#     confidence: float


class OGBVResponse(BaseModel):
    #probabilities: Dict[str, float]
    sentiment: str
    confidence: float


@app.post("/predict", response_model=OGBVResponse)
def predict(request: OGBVRequest,model: Model = Depends(get_model)):
    #sentiment, confidence, probabilities = model.predict(request.text)
    sentiment,confidence = model.predict(request.text)
    return OGBVResponse(
    #   sentiment="neutral", confidence=0.99, probabilities=dict(negative=0.005,neutral=0.99,positive=0.005),
        sentiment = sentiment,confidence = confidence
    )