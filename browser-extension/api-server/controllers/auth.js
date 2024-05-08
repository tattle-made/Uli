//console.log(`Environment : ${process.env.NODE_ENV}`);


const { registerAnonymousUser } = require("../controller-auth");


const register =  async (req, res) => {
  try {
    const newUser = await registerAnonymousUser();
    res.send({ user: newUser });
  } catch (err) {
    console.log(err);
    res.status(501).send();
  }
};



module.exports = {register} ; 