#!/bin/sh
npm install sequelize-cli
npx sequelize-cli db:migrate
nodemon index.js
