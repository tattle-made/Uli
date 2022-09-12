from typing import Dict

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from .classifier.model import Model, get_model #requires download_model.py to run

app = FastAPI()

import requests
import os 

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OGBVRequest(BaseModel):
    text: str

# class OGBVResponse(BaseModel):
#     probabilities: Dict[str, float]
#     sentiment: str
#     confidence: float


class OGBVResponse(BaseModel):
    # probabilities: Dict[str, float]
    sentiment: str
    confidence: float


@app.post("/predict", response_model=OGBVResponse)
def predict(request: OGBVRequest,model: Model = Depends(get_model)):
    payload_dict = jsonable_encoder(request)
    print(payload_dict)
    print(type(payload_dict))
    sentiment,confidence = model.predict(payload_dict["text"])
    return OGBVResponse(
        sentiment = sentiment,confidence = confidence
    )

