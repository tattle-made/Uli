import csv
import torch
from typing import TYPE_CHECKING, Any, Callable, Dict, List, Optional, Tuple, Union
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer
import pdb
import numpy as np
from torch import nn
import argparse
import random
from torch.utils.data import DataLoader
from sklearn.metrics import f1_score
from sklearn.metrics import accuracy_score
from tqdm import tqdm
import os

all_langs = ["hindi", "tamil", "telugu", "malyalam", "kannada"]

class MACDDataset(torch.utils.data.Dataset):
    
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {k: torch.tensor(v[idx]) for k, v in self.encodings.items()}
        item["labels"] = torch.tensor([self.labels[idx]])
        return item

    def __len__(self):
        return len(self.labels)

def read_text_label(base_path, lang, split):

    split_text, split_labels = [], []

    print(f"Reading {split} for {lang} from {base_path + f'{lang}_{split}.csv'}")
    with open(base_path + f'{lang}_{split}.csv', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row['label'].strip():
                continue
            split_text.append(row['text'])
            split_labels.append(int(float(row['label'])))

    return split_text, split_labels
    
def prepare_test_dataset(args, lang, tokenizer):
    test_text, test_labels = read_text_label(args.base_path, lang, "test")
    # Encode Dataset
    test_text = encode_dataset(test_text, None, None, tokenizer, args.max_length, True)
    test_dataset = MACDDataset(test_text, test_labels)
    return test_dataset

def prepare_dataset(args, tokenizer):

    train_text, train_labels = read_text_label(args.base_path, args.lang, "train")
    val_text, val_labels = read_text_label(args.base_path, args.lang, "val")
    test_text, test_labels = read_text_label(args.base_path, args.lang, "test")
    
    # Encode Dataset
    train_text, val_text, test_text = encode_dataset(train_text, val_text, test_text, tokenizer, args.max_length)
    train_dataset = MACDDataset(train_text, train_labels)
    test_dataset = MACDDataset(test_text, test_labels)
    val_dataset = MACDDataset(val_text, val_labels)
    return train_dataset, val_dataset, test_dataset

def encode_dataset(train_text, val_text, test_text, tokenizer, max_length, is_test=False):
    if is_test:
        test_encodings = tokenizer(train_text, truncation=True, padding=True, max_length=max_length)
        return test_encodings
    else:
        train_encodings = tokenizer(train_text, truncation=True, padding=True, max_length=max_length)
        val_encodings = tokenizer(val_text, truncation=True, padding=True, max_length=max_length)
        test_encodings = tokenizer(test_text, truncation=True, padding=True, max_length=max_length)
        return train_encodings, val_encodings, test_encodings

def get_metrics(preds, labels):
    acc = accuracy_score(labels, preds)
    f1_micro = f1_score(labels, preds, average='micro')  
    f1_macro = f1_score(labels, preds, average='macro') 
    print ('jacc acc:{}, f1 micro score:{} f1 macro score:{}'.format(acc, f1_micro, f1_macro))
    return acc, f1_micro, f1_macro

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    acc, f1_micro, f1_macro = get_metrics(preds, labels)
    print(f"accuracy: {acc}, f1_macro: {f1_macro}, f1_micro: {f1_micro}")
    #return {'accuracy': acc, "f1_macro": f1_macro, "f1_micro": f1_micro}
    return {'f1_macro':f1_macro, 'accuracy':acc}

def evaluate(input_ids, attn_mask, token_type_ids, label, model, use_cuda=False):
    with torch.no_grad():
        if use_cuda:
            input_ids = input_ids.cuda()
            attn_mask = attn_mask.cuda()
            if token_type_ids is not None:
                token_type_ids = token_type_ids.cuda()
        logits = model(input_ids, attn_mask, token_type_ids)
        preds = torch.argmax(logits.logits, dim=-1)
    return preds.cpu().tolist(), label.tolist()
        
def finetune_model(args):
    
    # Model and Tokenizer
    if args.model_name == "abusexlmr":
        tokenizer = AutoTokenizer.from_pretrained("xlm-roberta-base", use_fast = True)
    else:
        tokenizer = AutoTokenizer.from_pretrained(args.model_checkpoint, use_fast = True)
    model = AutoModelForSequenceClassification.from_pretrained(args.model_checkpoint, num_labels = args.num_labels)
    if args.cuda:
        model = model.cuda()

    # Dataset
    train_dataset, val_dataset, test_dataset = prepare_dataset(args, tokenizer)
    
    train_args = TrainingArguments(
        args.output_dir,
        eval_strategy = "epoch",
        save_strategy = "epoch",
        learning_rate = 2e-5,
        per_device_train_batch_size = args.batch_size,
        per_device_eval_batch_size = args.batch_size,
        num_train_epochs = args.num_epochs,
        weight_decay = 0.01,
        load_best_model_at_end = True,
        metric_for_best_model = 'f1_macro'
    )

    trainer = Trainer(
        model=model,
        args=train_args,
        train_dataset = train_dataset,
        eval_dataset = val_dataset,
        processing_class = tokenizer,
        compute_metrics = compute_metrics
    )
    
    print ('-'*50)
    print("Training the model")
    
    trainer.train()
    print ('-'*50)
    
    print("Evaluating the best model on test set")
    test_metrics = trainer.predict(test_dataset)
    test_f1_score = test_metrics[2]["test_f1_macro"]
    test_acc = test_metrics[2]["test_accuracy"]
    print(f"Saving test performance of best models {args.output_dir}/test_results.txt")
    test_fh = open(args.output_dir+"/test_results.txt", "w")
    test_fh.write(str(test_f1_score)+":"+str(test_acc))
    test_fh.close()

def set_seeds(seed):
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)

def get_model(args):
    if args.model_name == "muril":
        return "google/muril-base-cased"
    elif args.model_name == "mbert":
        return "bert-base-multilingual-cased"
    elif args.model_name == "xlmr":
        return "xlm-roberta-base"
    elif args.model_name == "abusexlmr":
        return "path/to/abuseXLMR"
    else:
        print("Model not supported")
        os.out()

if __name__=='__main__':
    
    parser = argparse.ArgumentParser('Finetune BERTs for abuse detection')
    parser.add_argument('--cuda', action = 'store_true', default=False, help = 'use gpu or not')
    parser.add_argument('--model_checkpoint', type = str, default = 'bert-base-cased')
    parser.add_argument('--lang', type = str, default = 'Hindi', choices = ["hindi", "tamil", "telugu", "malyalam", "kannada"])
    parser.add_argument('--num_labels', type = int, default = '2')
    parser.add_argument('--batch_size', type = int, default = '8')
    parser.add_argument('--num_epochs', type = int, default = '15')
    parser.add_argument('--max_length', type = int, default = '512')
    parser.add_argument('--seed', type = int, default = 393)
    parser.add_argument('--base_path', type = str, default = './dataset/')
    parser.add_argument('--model_name', type = str, default = 'xlmr', choices=["muril", "xlmr", "mbert", "abusexlmr"])
    
    args = parser.parse_args()
    args.model_checkpoint = get_model(args)
    
    args.output_dir = "./output/" + "-".join([args.lang, args.model_checkpoint, str(args.seed), str(args.num_epochs)])
    
    print (args)
    set_seeds(args.seed)
    finetune_model(args)
    