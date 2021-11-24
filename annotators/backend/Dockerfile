FROM node:15.7.0-alpine3.12
WORKDIR /app

COPY package.json /app/package.json
RUN npm install
COPY . .

CMD ["node", "index.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]