# Run the server using docker

```
docker build -t ml .
docker run -p 8080:80 ml
```

# Test the API endpoint

```
curl -X POST http://localhost:8000/predict -H 'Content-Type: application/json' -d '{"text":"The food in this restaurant is disgusting"}'
```
