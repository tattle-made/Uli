# Annotators Backend 

> The backend runs on nodejs. 
> We start by installing npm dependencies.

> You only have to do this step once after cloning the directory

```bash
npm i 
```
#### Deploy Backend Server

```bash
node index.js  
```
This runs on port `3000`

> Use `console.log()` anywhere in the backend to find any reaction in the console screen in which you started this server 

## Create tables in the MySQL DB

Change directory to `sequelize`:
> Sequelize is a promise-based Node.js ORM for MySQL

> npx is a CLI tool whose purpose is to make it easy to install and manage dependencies hosted in the npm registry.
```bash
cd sequelize
npx sequelize-cli db:migrate
```
Seed data to the database
```bash
npx sequelize-cli db:seed --seed 20211115172651-beta-test
```
> `20211115172651-beta-test.js` file is in /sequelize/seeders . There are more files over there that you can try this with.

Takes/Seeds out the last data added to the  DB
```bash
npx sequelize-cli db:seed:undo
```

## Work with APIs

> `index.js`  contains all the API routes

> `annotation-ui/src`  contains all the frontend pages calling the APIs at `${config.api_endpoint}`

> `controller.js` contains all the sql queries that are fired when an API is called.
#### Currently developed APIs 
- `/login`
- `/allocation/for-user/`
- `/annotation/by-user/`
- `/annotations`
- `/session`
- `/post/:postId`
- `/posts`
- `/dashboard`
- `/dashboard/for-user`
- `/annotations/type/csv` 

The apis are listed below with the react pages that call them from the frontend `annotation-ui/src`
```
backend/index.js:app.post("/api/login", async (req, res) => {
annotation-ui/src/repository/user.js:   return axios.post(`${config.api_endpoint}/login`, {


backend/index.js:app.get("/api/allocation/for-user/", async (req, res) => {
annotation-ui/src/repository/allocation.js:    `${config.api_endpoint}/allocation/for-user?userId=${userId}&pageNum=${pageNum}`
annotation-ui/src/components/AllotationList.jsx:      `${config.api_endpoint}/allocation/for-user/?userId=${userId}&page=${pageNum}`



backend/index.js:app.get("/api/annotation/by-user/", async (req, res) => {
annotation-ui/src/repository/allocation.js:      `${config.api_endpoint}/annotation/by-user?userId=${userId}&postId=${postId}`


backend/index.js:app.post("/api/annotations/", async (req, res) => {
annotation-ui/src/repository/annotation.js:  return axios.post(`${config.api_endpoint}/annotations`, {


backend/index.js:app.post("/api/session", async (req, res) => {
annotation-ui/src/repository/session.js:                `${config.api_endpoint}/session?userId=${userId}`,


backend/index.js:app.get("/api/post/:postId", async (req, res) => {
annotation-ui/src/components/private-pages/PostDetailPage.jsx:    const res = await axios.get(`${config.api_endpoint}/post/${postId}`);


backend/index.js:app.get("/api/posts", async (req, res) => {
annotation-ui/src/components/private-pages/PostListPage.jsx:    return axios.get(`${config.api_endpoint}/posts?page=${pageNum}`);


backend/index.js:app.get("/api/dashboard", async (req, res) => {
annotation-ui/src/pages/dashboard.jsx:      const { data } = await axios.get(`${config.api_endpoint}/dashboard`);


backend/index.js:app.get("/api/dashboard/for-user", async (req, res) => {
annotation-ui/src/repository/user.js:           `${config.api_endpoint}/dashboard/for-user?userId=${userId}`



backend/index.js:app.get("/api/annotations/type/csv", async (req, res) => {
annotation-ui/src/pages/dashboard.jsx:      `${config.api_endpoint}/annotations/type/csv`

```
