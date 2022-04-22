console.log(`in config.js. environment ${process.env.NODE_ENV}`);

const { ENVIRONMENT, LOCAL_STORAGE_NAME, API_URL } = process.env;

export default {
  ENVIRONMENT,
  LOCAL_STORAGE_NAME,
  API_URL,
};
