### Slur Replacement Methodology

Two cases
- Exact Matching
- Approximate Matching


#### Case 1 : Exact Matching

- case insensitive
- lowercase the slurs for exact matching
- splitting by 'space' for tokenizing the tweet

#### Case 2 : Approximate Matching
```
pip install fuzzywuzzy
```
- using fuzzywuzzy (Levenstein distance)

  - using fuzzy score
  - using edit distance


 
```
pip install fastDamerauLevenshtein
```
  
- using DamerauLevenshtein
