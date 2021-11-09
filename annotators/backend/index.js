const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.options("*", cors());
app.use(express.static("dist"));

const { getAllocationForUser, getPostWithAnnotation } = require("./test");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/allocation/for-user/", async (req, res) => {
  const { userId } = req.query;

  const allocations = await getAllocationForUser({
    id: userId,
  });
  allocationDataArray = allocations.map((allocation) =>
    allocation.get({ plain: true })
  );

  res.send({ allocation: allocationDataArray });
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
