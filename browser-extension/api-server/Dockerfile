FROM node:18.18.2-alpine3.18@sha256:0fe7402d11d8c85474c6ec6f9c9c8048cd0549c95535832b7f0735a4b47690a5
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
