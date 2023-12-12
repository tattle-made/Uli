FROM node:20.10.0-alpine3.19@sha256:9e38d3d4117da74a643f67041c83914480b335c3bd44d37ccf5b5ad86cd715d1
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
