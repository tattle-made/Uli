module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "uli_dev",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "uli_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "uli_prod_unicode",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};
