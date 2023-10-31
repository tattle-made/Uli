FROM node:20.9.0-alpine3.18@sha256:8e015de364a2eb2ed7c52a558e9f716dcb615560ffd132234087c10ccc1f2c63
ENV NODE_ENV production
WORKDIR /app

COPY --chown=node:node package.json /app/package.json
RUN cd /app
RUN npm install --ignore-scripts
RUN npm install sequelize-cli --ignore-scripts
RUN npm install -g nodemon --ignore-scripts
COPY --chown=node:node . .
COPY --chown=node:node ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
USER node
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
