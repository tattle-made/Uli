const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(express.static("public"));
const { Op, Sequelize } = require("sequelize");

console.log(process.env.NODE_ENV);

Sequelize.addHook("beforeCount", function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (options.include && options.include.length > 0) {
    options.include = null;
  }
});

const {
  getAllocationForUser,
  getPostWithAnnotation,
  getPosts,
  getUserAnnotationsForPost,
  addAnnotations,
  getUser,
  getDashboard,
  getAnnotations,
  getDashboardforUser,
  saveSession,
} = require("./controller");

// app.get("/", (req, res) => {
// 	res.send("Hello World! !");
// });

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username, password);
  res.send({ ...user });
});

app.get("/api/allocation/for-user/", async (req, res) => {
  const { userId, pageNum } = req.query;
  const pageNumInt = parseInt(pageNum);

  const { allocations, count } = await getAllocationForUser(userId, pageNumInt);

  res.send({ allocations, count });
});

app.get("/api/annotation/by-user/", async (req, res) => {
  const { userId, postId } = req.query;

  const annotations = await getUserAnnotationsForPost(userId, postId);
  annotationsPlain = annotations.map((annotation) =>
    annotation.get({ plain: true })
  );

  res.send({ annotations: annotationsPlain });
  // res.status(404).end();
});

app.post("/api/annotations/", async (req, res) => {
  console.log(req.body);
  const { userId, postId, annotations } = req.body;
  let summary = await addAnnotations(
    { id: userId },
    { id: postId },
    annotations
  );
  res.send({ postId, input: annotations, summary });
  // res.status(404).end();
});

app.post("/api/session", async (req, res) => {
  const { userId } = req.query;
  const session = req.body;
  console.log("store session");
  // console.log({ userId, ...session });
  await saveSession(userId, session);
  res.send({ msg: "done" });
});

app.get("/api/post/:postId", async (req, res) => {
  const { postId } = req.params;

  const post = await getPostWithAnnotation(postId);
  //   console.log(post);
  res.send({ post: post.get({ plain: true }) });

  // const annotations = await getAnnotationsForPost({
  //   id: "0aa21bb9-ba27-471d-aeff-60feb01a04a9",
  // });
  // for (const annotation of annotations) {
  //   console.log(annotation.get({ plain: true }));
  // }
});

app.get("/api/posts", async (req, res) => {
  const { page } = req.query;
  const pageInt = parseInt(page);

  const posts = await getPosts(pageInt);
  res.send({ ...posts });
});

app.get("/api/dashboard", async (req, res) => {
  const status = await getDashboard();
  res.send({ status });
});

app.get("/api/dashboard/for-user", async (req, res) => {
  const { userId } = req.query;
  const status = await getDashboardforUser(userId);
  res.send({ status });
});

app.get("/api/annotations/type/csv", async (req, res) => {
  const tweets = await getAnnotations();
  res.send({ tweets });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
