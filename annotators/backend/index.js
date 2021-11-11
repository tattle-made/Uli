const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.options("*", cors());
app.use(express.static("dist"));
const { Op, Sequelize } = require("sequelize");

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
} = require("./test");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/allocation/for-user/", async (req, res) => {
  const { userId, pageNum } = req.query;
  const pageNumInt = parseInt(pageNum);

  const { allocations, count } = await getAllocationForUser(userId, pageNumInt);

  res.send({ allocations, count });
});

app.get("/annotation/by-user/", async (req, res) => {
  const { userId, postId } = req.query;

  const annotations = await getUserAnnotationsForPost(userId, postId);
  annotationsPlain = annotations.map((annotation) =>
    annotation.get({ plain: true })
  );

  res.send({ annotations: annotationsPlain });
});

app.get("/post/:postId", async (req, res) => {
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

app.get("/posts", async (req, res) => {
  const { page } = req.query;
  const pageInt = parseInt(page);

  const posts = await getPosts(pageInt);
  res.send({ ...posts });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
