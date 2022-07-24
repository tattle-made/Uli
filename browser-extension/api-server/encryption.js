const Cryptr = require("cryptr");

let crypter;
try {
  crypter = new Cryptr(process.env.DB_FIELD_ENCRYPTION_KEY);
} catch {
  console.log("could not initialize crytper");
}

function encrypt(value) {
  return crypter.encrypt(value);
}

function decrypt(encryptedValue) {
  return crypter.decrypt(encryptedValue);
}

module.exports = {
  encrypt,
  decrypt,
};
