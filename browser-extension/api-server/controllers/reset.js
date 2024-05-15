//console.log(`Environment : ${process.env.NODE_ENV}`);

const { resetUser } = require("../controller-auth");


const resetAccount =  async (req, res) => {
  const { user } = req;
  const userId = user.id;
  console.log(`reset request for ${userId}`);
  try {
    await resetUser(userId);
    res.send({ message: "Account reset" });
  } catch (err) {
    console.log(`Error : unable to reset account`);
    console.log(err);
    res.status(501).send("Could not reset account");
  }
};

module.exports = {resetAccount} ; 