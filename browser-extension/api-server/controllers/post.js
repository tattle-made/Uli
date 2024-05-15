//console.log(`Environment : ${process.env.NODE_ENV}`);

const {
  post
} = require("../db/models");


const getPost =  async (req, res) => {
  const user = req.user;
  const result = post.findAll({
    where: {
      userId: user.id,
    },
    limit: 20,
  });
  res.send({ posts: result.map((res) => res.get({ plain: true })) });
};

module.exports = {getPost} ; 
