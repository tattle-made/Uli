# Go through the following steps to run the server using docker locally: 

## 1. Clone the repository in your local machine and navigate to the 'FastAPI - OGBV' folder.
## 2. Run the following command to build the docker. Note that if you are on a Windows machine, you will need to change the file format of the 'download_model' file to 'unix'. More information on this can be found [here](https://tanutaran.medium.com/solving-git-lf-will-be-replaced-by-crlf-7ca84eb0aad4) and [here](https://stackoverflow.com/questions/19425857/env-python-r-no-such-file-or-directory).

```
docker build -t ml .
```
## 3. After your docker is built, run it using the following command
```
docker run -p 8080:80 ml
```

## 4. Test the API endpoint by running the following command:

```
curl -X POST http://localhost:8080/predict -H 'Content-Type: application/json' -d '{"text":"The food in this restaurant is disgusting"}'
```
### Note that if you are on windows and are using PowerShell, you might need to run this command instead of the previous one for making POST requests:
```
Invoke-RestMethod -Method 'Post' -Uri http://localhost:8080/predict -Body (@{"text"="The food in this restaurant is disgusting"}|ConvertTo-Json) -ContentType "application/json"
```
