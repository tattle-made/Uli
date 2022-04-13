FROM python:3.8.2

WORKDIR /app
COPY ./ /app
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
#CMD ["tail","-f","/dev/null"]