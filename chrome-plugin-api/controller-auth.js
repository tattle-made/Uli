const { user } = require("./db/models");
var generatePassword = require("password-generator");
const { v4: uuidv4 } = require("uuid");

async function registerAnonymousUser() {
  const username = generatePassword();
  const password = generatePassword(12, false);
  const accessToken = uuidv4();
  const refreshToken = uuidv4();

  const newUser = await user.create({
    username,
    password,
    accessToken,
    refreshToken,
  });
  return newUser.get({ plain: true });
}

module.exports = { registerAnonymousUser };
