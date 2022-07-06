import json

import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification

with open("config.json") as json_file:
    config = json.load(json_file)

#tokenizer = AutoTokenizer.from_pretrained(config['MODEL'])
#model = AutoModelForSequenceClassification.from_pretrained(config['MODEL'])
label_map= {
        0: 'None', 
        1: 'Hate'
    }

def preprocess(text):
    new_text = []
    for t in text.split(" "):
        t = '@user' if t.startswith('@') and len(t) > 1 else t
        t = 'http' if t.startswith('http') else t
        new_text.append(t)
    return " ".join(new_text)

class Model:

    def __init__(self):

        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

        self.tokenizer = AutoTokenizer.from_pretrained(config['MODEL'])
        classifier = AutoModelForSequenceClassification.from_pretrained(config['MODEL'])

        classifier.load_state_dict(
            torch.load(config["PRE_TRAINED_MODEL"], map_location=self.device)
        )
        
        self.classifier = classifier.to(self.device)
    
    def predict(self,text):

        clean_text = preprocess(text)
        encoded_input = self.tokenizer(clean_text, return_tensors='pt', padding=True, truncation=True, max_length=128)
    
        encoded_input.to(self.device)

        output = self.classifier(**encoded_input)
        
        with torch.no_grad():

            out = F.softmax(output[0].data, dim=-1).detach().cpu()

            #print(out)

            out_label = torch.argmax(out,-1).numpy()

            #print(out_label)
            return (
                label_map[out_label[0]],
                out[0][out_label].numpy()[0]
            )

            # print(out[0][out_label].numpy()[0])
            # print(label_map[out_label[0]])

            #print(label_map[i] for i in torch.argmax(out,-1).numpy())

        # input_ids = encoded_input["input_ids"].to(self.device)
        # attention_mask = encoded_input['attention_mask'].to(self.device)

        # with torch.no_grad():

        #     probs = F.softmax()

model = Model()
#model.predict('')

def get_model():
    return model