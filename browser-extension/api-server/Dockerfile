FROM node:18.17.1-alpine3.18@sha256:3482a20c97e401b56ac50ba8920cc7b5b2022bfc6aa7d4e4c231755770cf892f
ENV NODE_ENV production
WORKDIR /app

COPY --chown=node:node package.json /app/package.json
RUN cd /app
RUN npm install --ignore-scripts
RUN npm install sequelize-cli --ignore-scripts
RUN npm install -g nodemon --ignore-scripts
COPY . .
COPY --chown=node:node ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
USER node
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
