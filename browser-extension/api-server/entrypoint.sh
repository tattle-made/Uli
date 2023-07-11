#!/bin/sh
npx sequelize-cli db:migrate
nodemon index.js
