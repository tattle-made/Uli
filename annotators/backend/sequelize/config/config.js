module.exports = {
	development: {
		username: "tattle",
		password: "tattle_pw",
		database: "ogbv_annotator_local",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	test: {
		username: "root",
		password: null,
		database: "memebox",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "ogbv_annotator",
		host: process.env.DB_HOST,
		dialect: "mysql",
	},
};
