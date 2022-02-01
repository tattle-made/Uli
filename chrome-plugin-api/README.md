# Development
1. run `docker-compose up`
ensure that mysql is running. A gui can be found at localhost:8080.
Enter the following values to connect to it.
Server : db
Username : tattle
Password : tattle_pw
Database : ogbv_plugin

2. Ensure all the environtment variables specified in development.env file are set.

3. run `npm install`

4. run `npx sequelize-cli db:migrate`
This should create your tables in the db.


5. run `nodemon index.js`
This should start an express http server at port 3000

# Deploying to Tattle's Kubernetes 
Prerequisite : 
1. You must be logged in into tattle's docker account
2. You must have the appropriate kubeconfig file to deploy to the Kubernetes clsuter.
Ensure your has execution rights on `deploy.sh`
Open deploy.sh and modify the version number.
run `./deploy.sh`