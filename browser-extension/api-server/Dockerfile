FROM node:18.18-alpine3.18@sha256:a315556d82ef54561e54fca7d8ee333382de183d4e56841dcefcd05b55310f46
ENV NODE_ENV production
WORKDIR /app

COPY --chown=node:node package.json /app/package.json
RUN cd /app
RUN npm install --ignore-scripts
RUN npm install sequelize-cli --ignore-scripts
RUN npm install -g nodemon --ignore-scripts
COPY --chown=node:node ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
USER node
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
