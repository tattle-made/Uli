FROM python:3.8.2

WORKDIR /app
COPY ./ /app
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
EXPOSE 80
CMD chmod 755 /app/main.sh && /app/main.sh

# CMD ["tail","-f","/dev/null"]
