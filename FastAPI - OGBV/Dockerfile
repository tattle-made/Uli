FROM python:3.8.2

WORKDIR /app
COPY ./ /app
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

RUN ["chmod", "+x", "/app/bin/download_model"]
RUN /app/bin/download_model
EXPOSE 80

CMD ["uvicorn", "sentiment_analyzer.api:app", "--host", "0.0.0.0", "--port", "80"]
# CMD ["tail","-f","/dev/null"]
