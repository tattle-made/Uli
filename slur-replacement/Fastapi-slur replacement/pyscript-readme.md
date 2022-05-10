## Run slur replacement in the browser using pyscript

PS: pyscript is in alpha mode.

### Steps: 

1. CD into `OGBV/slur-replacement/Fastapi-slur replacement`
2. Run a web server, for example:
```
cd "OGBV/slur-replacement/Fastapi-slur replacement"
python3 -m http.server 12345  # serve from from pwd on port 12345
```
3. Open the browser to index.html: `http://localhost:12345/index.html`
4. Wait for status to become ready
5. Type in your tweet and click on convert


### Change made to python code: 
1. Using pylev instead of levenshtein library since pylev is pure python
2. Commented print statements
