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

