module.exports = {
  development: {
    username: "tattle",
    password: "tattle_pw",
    database: "uli_dev",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "uli_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "uli_prod",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
