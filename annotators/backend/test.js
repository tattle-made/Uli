const {
  User,
  Post,
  Annotation,
  UserPostAllocation,
} = require("./sequelize/models");
const { Op } = require("sequelize");
const { LoremIpsum } = require("lorem-ipsum");

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const users = [
  { role: "admin", username: "user_a", password: "asdfasdf", lang: "en" },
];

function createUsers() {
  return User.bulkCreate([
    { role: "admin", username: "admin_a", password: "pw_adm_a", lang: "en" },
    { role: "editor", username: "editor_a", password: "pw_ed_a", lang: "en" },
    {
      role: "annotator",
      username: "annotator_a",
      password: "pw_ann_a",
      lang: "hi",
    },
    {
      role: "annotator",
      username: "annotator_b",
      password: "pw_ann_b",
      lang: "hi",
    },
    {
      role: "annotator",
      username: "annotator_c",
      password: "pw_ann_c",
      lang: "hi",
    },
  ]);
}

function createPosts() {
  return Post.bulkCreate([
    { role: "text", text: "asdfasdfasdfasdfasdf" },
    { role: "text", text: "shsdfgsdfgsdfgsafg g" },
    { role: "text", text: "34534fggsdgsadfhgasfg" },
    { role: "text", text: "kgjkfgjhfghkbnkfui" },
    { role: "text", text: "8ououfghdfesxhaweawe" },
    { role: "text", text: "pyowenasmciowp[[[wwe" },
    {
      role: "image",
      url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
    },
    {
      role: "image",
      url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
    },
    {
      role: "image",
      url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
    },
    {
      role: "image",
      url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
    },
    {
      role: "image",
      url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
    },
  ]);
}

function allocatePosts() {
  return UserPostAllocation.bulkCreate([
    {
      userId: "9404f34a-c36e-4437-82d2-aee3f22fb93c",
      postId: "98064848-2b42-4bc9-8060-8857351df3ba",
      status: "pending",
    },
    {
      userId: "9404f34a-c36e-4437-82d2-aee3f22fb93c",
      postId: "a7125df7-2b9f-4ee8-a08c-4dbed23f4c23",
      status: "pending",
    },
    {
      userId: "9404f34a-c36e-4437-82d2-aee3f22fb93c",
      postId: "aca48dcc-77dc-415e-8335-c767a6a54fc3",
      status: "pending",
    },
    {
      userId: "9404f34a-c36e-4437-82d2-aee3f22fb93c",
      postId: "b12c201b-20dc-4983-b579-b9591e71b046",
      status: "pending",
    },
  ]);
}

async function getAllocationForUser(userId, pageNum) {
  const { rows, count } = await UserPostAllocation.findAndCountAll({
    where: {
      userId: userId,
    },
    limit: 20,
    offset: pageNum * 20,
    include: [/*User,*/ Post],
  });

  const allocations = rows.map((post) => post.get({ plain: true }));
  return { allocations, count };
}

function getAnnotationsForPost({ id }) {
  return Annotation.findAll({
    where: {
      postId: id,
    },
  });
}

function getUserAnnotationsForPost(userId, postId) {
  return Annotation.findAll({
    where: {
      [Op.and]: [{ userId }, { postId }],
    },
  });
}

function complexQuery() {
  return Annotation.findAll({
    where: {
      [Op.and]: [{ key: "ogbv" }, { value: 1 }],
    },
    include: [Post, User],
  });
}

async function isUserRegistered({ username, password }) {
  const { count, rows } = await User.findAndCountAll({
    where: {
      [Op.and]: [{ username, password }],
    },
  });
  return count == 0 ? false : rows[0].get({ plain: true });
}

async function getUser(username, password) {
  const { count, rows } = await User.findAndCountAll({
    where: {
      [Op.and]: [{ username, password }],
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });
  return count == 0
    ? { user: undefined, preference: undefined, session: undefined }
    : { user: rows[0].get({ plain: true }), session: {}, preference: {} };
}

async function addAnnotation(user, post, key, value) {
  return Annotation.findOne({
    where: {
      [Op.and]: [{ userId: user.id }, { postId: post.id }, { key }],
    },
  }).then((obj) => {
    // console.log(obj);
    if (obj) {
      return obj.update({ key, value });
    } else {
      return Annotation.create({
        userId: user.id,
        postId: post.id,
        key,
        value,
      });
    }
  });
}

async function addAnnotations(user, post, annotations) {
  for (const annotation of annotations) {
    await addAnnotation(user, post, annotation.key, annotation.value);
  }
}

async function getPosts(pageNum) {
  const { rows, count } = await Post.findAndCountAll({
    limit: 20,
    offset: pageNum,
  });
  const posts = rows.map((post) => post.get({ plain: true }));
  return { posts, count };
}

async function getPostsWithAnnotation(pageNum) {
  return await Annotation.findAll({});
}

async function getPostWithAnnotation(postId) {
  return await Post.findOne({
    where: {
      id: postId,
    },
    include: Annotation,
  });
}

async function createDummyPosts(count) {
  for (var i = 0; i < count; i++) {
    var params = {};
    params.role = Math.floor(Math.random() * 2) ? "text" : "image";
    if (params.role === "text") {
      params.text = lorem.generateWords(20);
    } else if (params.role === "image") {
      params.url =
        "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg";
    }
    console.log(params);
    await Post.create(params);
  }
}

async function allocatePostsAutomatically(userId, postCount) {
  const { rows, count } = await Post.findAndCountAll({
    limit: postCount,
    offset: 1,
  });
  const posts = rows.map((post) => post.get({ plain: true }));
  posts.map(async (post) => {
    await UserPostAllocation.create({
      userId: userId,
      postId: post.id,
    });
  });
}

(async function test() {
  // await createUsers();
  // await createPosts();
  // await allocatePosts();
  // const allocations = await getAllocationForUser({
  //   id: "f32fbcfe-2351-4264-bafe-040274f469db",
  // });
  // for (const allocation of allocations) {
  //   console.log(allocation.get({ plain: true }));
  // }
  // GET ANNOTATIONS
  // const annotations = await getAnnotationsForPost({
  //   id: "0aa21bb9-ba27-471d-aeff-60feb01a04a9",
  // });
  // for (const annotation of annotations) {
  //   console.log(annotation.get({ plain: true }));
  // }
  // TEST complex Query
  // const results = await complexQuery({
  //   id: "0aa21bb9-ba27-471d-aeff-60feb01a04a9",
  // });
  // for (const result of results) {
  //   console.log(result.get({ plain: true }));
  // }
  // const status = await isUserRegistered({
  //   username: "annotator_a",
  //   password: "pw_ann_a",
  // });
  // console.log(status);
  // const result = await addAnnotation(
  //   { id: "c76bafbb-eda0-4ce7-b88c-9b40e498e056" },
  //   { id: "0aa21bb9-ba27-471d-aeff-60feb01a04a9" },
  //   "ogbv",
  //   "1"
  // );
  // console.log(result);
  // const result = await addAnnotations(
  //   { id: "f32fbcfe-2351-4264-bafe-040274f469db" },
  //   { id: "23378d4f-8535-42a3-8276-632e86286110" },
  //   [
  //     { key: "ogbv", value: "0" },
  //     { key: "explicit", value: "0" },
  //     { key: "hate", value: "1" },
  //   ]
  // );
  // const results = await getPostsWithAnnotation(0);
  // console.log(results);
  // for (const result of results) {
  //   console.log(result.get({ plain: true }));
  // }
  // createDummyPosts(1000);
  // await allocatePostsAutomatically("f32fbcfe-2351-4264-bafe-040274f469db", 100);
})();

module.exports = {
  getAllocationForUser,
  getPostWithAnnotation,
  getPosts,
  getUserAnnotationsForPost,
  addAnnotations,
  getUser,
};
