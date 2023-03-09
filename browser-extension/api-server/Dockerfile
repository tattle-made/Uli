FROM node:16-alpine
WORKDIR /app

COPY package.json /app/package.json
RUN cd /app
RUN npm install
RUN npm install sequelize-cli
RUN npm install -g nodemon
COPY . .

CMD ["node", "index.js"]