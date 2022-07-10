module.exports = {
  development: {
    username: "tattle",
    password: "tattle_pw",
    database: "ogbv_plugin",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "ogbv_plugin",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
