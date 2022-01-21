const csv = require("csv-parser");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const results = [];
// const data = require("../backend/sequelize/seeders/posts-beta-test.json");

// console.log(data.posts[0]);
(async function process() {
<<<<<<< HEAD
	fs.createReadStream("posts_beta_7.csv")
=======
	fs.createReadStream("posts_beta_5_en.csv")
>>>>>>> 959b6098fa3d8cbcc8cceaaf0b45bc9ee2f30529
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", async () => {
			await writeFile(
<<<<<<< HEAD
				"posts_beta_7.json",
=======
				"posts_beta_5_en.json",
>>>>>>> 959b6098fa3d8cbcc8cceaaf0b45bc9ee2f30529
				JSON.stringify({ posts: results })
			);
		});
})();
