//console.log(`Environment : ${process.env.NODE_ENV}`);

const express = require("express");
const app = express();
app.disable("x-powered-by");
const port = 3000;
const cors = require("cors");
const { authentication } = require("./middlewares");

app.use(cors());
app.use(authentication);
app.use(express.json());
app.options("*", cors());

app.use("/", require("./routes/slur.js"));
app.use("/", require("./routes/archive.js"));
app.use("/", require("./routes/reset.js"));
app.use("/", require("./routes/preference.js"));
app.use("/", require("./routes/predict.js"));
app.use("/", require("./routes/post.js"));
app.use("/", require("./routes/auth.js"));
app.use("/", require("./routes/feedback.js"));

console.log(`Environment : ${process.env.NODE_ENV}`);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
