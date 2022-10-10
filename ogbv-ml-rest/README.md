# OGBV ML REST Server

v:0.0.1

## Developing Locally

1. Clone the repository in your local machine and navigate to the 'ogbv-ml-rest' folder.
2. Run the following command to build the docker. Note that if you are on a Windows machine, you will need to change the file format of the 'download_model' file to 'unix'. More information on this can be found [here](https://tanutaran.medium.com/solving-git-lf-will-be-replaced-by-crlf-7ca84eb0aad4) and [here](https://stackoverflow.com/questions/19425857/env-python-r-no-such-file-or-directory).

```
docker build -t ml .
```

3. After your docker is built, run it using the following command:

```
docker run  -p 8080:80 -v ogbv-cache:/root/.cache/huggingface/transformers -v ogbv-assets:/app/assets ml
```
If this is the first time you are running the container, then this will create volumes: ogbv-assets and ogbv-cache and link them to the directories created for the container, from the next time onwards, the volumes will persist and even if the container perishes, running this command will immediately fetch the data from the volumes to the relevant directories saving time and data. Please delete the volumes and rerun this command when the models itself are updated.

4. Test the API endpoint by running the following command:

```
curl -X POST http://localhost:8080/predict -H 'Content-Type: application/json' -d '{"text":"The food in this restaurant is disgusting"}'
```

Note that if you are on windows and are using PowerShell, you might need to run this command instead of the previous one for making POST requests:

```
Invoke-RestMethod -Method 'Post' -Uri http://localhost:8080/predict -Body (@{"text"="The food in this restaurant is disgusting"}|ConvertTo-Json) -ContentType "application/json"
```
## Testing

1. Go to the following url and download the extension zip file present in the release: https://github.com/tattle-made/OGBV/releases
2. Extract the files locally and put the path to the dist folder present in the newly extracted files in the "options.add_argument" function in the slur_detection_tester.py file
3. Run the following in your test environment (in order):

```
pip install selenium
pip install webdriver-manager
```
4. Find a tweet with a known slur, you can look them up here: https://github.com/tattle-made/OGBV/blob/main/browser-extension/plugin/src/slur-replace.js. You'll need to hardcode the url in the "driver.get()" function. A known url is the following: https://twitter.com/jackantonoff/status/1579311659742416896. This should set you up for running the code. 