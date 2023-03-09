const axios = require("axios");

class CouldNotClassifyError extends Error {}

const ENVIRONMENT = process.env.NODE_ENV;
let API_URL =
  ENVIRONMENT === "production"
    ? "http://ogbv-ml-rest/predict"
    : "http://ogbv-ml-rest/predict";

async function classify(text) {
  const response = await axios.post(API_URL, {
    text,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new CouldNotClassifyError();
  }
}

module.exports = { classify };
