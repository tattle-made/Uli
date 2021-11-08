const {
  User,
  Post,
  Annotation,
  UserPostAllocation,
} = require("./sequelize/models");
const { Op } = require("sequelize");

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
      userId: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
      postId: "0aa21bb9-ba27-471d-aeff-60feb01a04a9",
      status: "pending",
    },
    {
      userId: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
      postId: "1b755657-7b51-499a-a4e8-b5068eb0b911",
      status: "pending",
    },
    {
      userId: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
      postId: "4bd5a046-8f20-403d-9e2f-22e9d90f56ee",
      status: "pending",
    },
    {
      userId: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
      postId: "7d8bed68-ee16-46e7-85df-33b72f880231",
      status: "pending",
    },
    {
      userId: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
      postId: "a3388e67-e379-40d6-9ef5-93a5dfef27e1",
      status: "pending",
    },
  ]);
}

function getAllocationForUser({ id }) {
  return UserPostAllocation.findAll({
    where: {
      userId: id,
    },
    include: [/*User,*/ Post],
  });
}

function getAnnotationsForPost({ id }) {
  return Annotation.findAll({
    where: {
      postId: id,
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

(async function test() {
  // await createUsers();
  // await createPosts();
  // await allocatePosts();
  // const allocations = await getAllocationForUser({
  //   id: "c76bafbb-eda0-4ce7-b88c-9b40e498e056",
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

  const status = await isUserRegistered({
    username: "annotator_a",
    password: "pw_ann_a",
  });
  console.log(status);
})();
