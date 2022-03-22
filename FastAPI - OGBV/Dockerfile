# 
FROM python:3.8.2

# 
WORKDIR /code

COPY ./config.json /code/config.json

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./bin/download_model /code/download_model 

RUN ["chmod", "+x", "/code/download_model"]

RUN /code/download_model

# 
COPY ./app /code/app

EXPOSE 80

# 
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]

CMD ["tail","-f","/dev/null"]