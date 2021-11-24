const csv = require("csv-parser");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const results = [];
// const data = require("../backend/sequelize/seeders/posts-beta-test.json");

// console.log(data.posts[0]);
(async function process() {
	fs.createReadStream("posts_beta_test.csv")
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", async () => {
			await writeFile(
				"posts-beta-test.json",
				JSON.stringify({ posts: results })
			);
		});
})();
