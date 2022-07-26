const { user } = require("./db/models");
var generatePassword = require("password-generator");
const { v4: uuidv4 } = require("uuid");

async function registerAnonymousUser() {
  const accessToken = uuidv4();
  const refreshToken = uuidv4();

  const newUser = await user.create({
    accessToken,
    refreshToken,
  });
  return newUser.get({ plain: true });
}

async function resetUser(userId) {
  await user.update(
    {
      status: "RESET",
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

module.exports = { registerAnonymousUser, resetUser };
