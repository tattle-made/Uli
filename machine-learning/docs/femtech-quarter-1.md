# Overview
We have standardized our workflows around the following processes :
• Creation or Curation of Datasets
• Pre processing data for use in training
• Scripts to train/finetune ML model
• Scripts to evaluate ML model

In the first quarter we did the following :
• Curate 2 and create and clean up 2 datasets.
• Create ML models for abuse detection
    - By finetuning on Language models
    - By creating decision tree
    - By prompt engineering LLMs or using LLM based model (Llamaguard)
• Wrote Scripts to evalute datasets on the ML Model

## Limitations
Abuse detection in Indian Languages is a nascent stage with a lack of task and language specific benchmarks. So for a lot of the work we are doing we have had to create our own datasets and ML model with no "objective" way to measure them. What we do know for certain is that the performance of any ML model will vary depending on the language and task. As a result we are not optimizing for the ML model's score yet because the datasets we have created/curated are imperfect. An actually representative data would come to us once we have users using a product, at which point we will do more finetuning and improvements. This quarter we focussed on getting the mechanical aspects of the code and workflows working end to end, i.e. datset creation -> pre processing -> model training -> model evaluation -> publish scores

## Scores
### Finetuned hindi-bert-base-multilingual-cased

| | |
|---|---|
|Accuracy|0.69|
|F1 Macro |0.79 |

### Llamaguard 
#### On HASOC Dataset
|             | accuracy | precision | recall | f1   |
| ----------- | -------- | --------- | ------ | ---- |
| Llama Guard | 0.55     | 0.84      | 0.13   | 0.22 |


#### On Sharechat Dataset

|             | accuracy | precision | recall | f1   |
| ----------- | -------- | --------- | ------ | ---- |
| Llama Guard | 0.55     | 0.84      | 0.13   | 0.22 |

# Dataset Description
## Sharechat 
A large-scale (150K), human-annotated, multilingual (5 languages), balanced (49% abusive content) and diverse (70K users) abuse detection dataset of user comments, sourced from a popular social media platform - ShareChat

## HASOC
A [dataset](https://hasocfire.github.io/hasoc/2024/dataset.html) of abusive texts sourced from twitter and facebook.

## Uli annotated tweets
24,000 manually annotated tweets created by the Tattle team to create an Abuse detection ML model

## Uli harmful and benign sentences
Around 100 pairs of sentences containing a slur in harmful and benign usage. 


# Milestone Updates : 
## Conceptualize Performance Metrics : 
### Static Benchmark : 
Out of the 4 datasets, the 2 datasets created by our team - annotated tweets and benign/harmful sentences will be treated as static benchmark datasets for now. These were manually created by our expert group. Once we have real data coming in through our product, we might add other static benchmarks to this or update this if needed. But for the next quarter, we are moving ahead with considering these as the static benchmarks.

### Dynamic test set creation protocol : 
As new data comes from our product, we will conduct its manual evaluation periodically. A detailed process that we have implemented for it has been documented [here](https://tattle.co.in/blog/2026-05-28-how-to-do-manual-evaluations/). This process involve annotating data manually and segmenting it into categories of abuse. This will help us create datasets that remain representative of abuse landscape and ensure we cover multiple categories of harm. 
While the manual process is useful when discovering patterns and nuances in new data, for capturing already established categories, we can consider using LLMs to assist our team members.

### Conceptualize Metrics
We are currently tracking Accuracy and F1 macro as the primary metric to account for performance across abuse categories. In addition, we plan to track per-class F1 and performance delta against the static benchmark to identify regressions and understand whether model improvements generalize to newly emerging patterns.

