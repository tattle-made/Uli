var fs = require("fs");

var result = "";

fs.readFileSync("slur_list_withspace.txt", "utf-8")
  .split(/\r?\n/)
  .forEach(function (line) {
    if (line === "---") {
    } else {
      //console.log(line);
      result += "|" + line;
    }
  });

var expression = result.slice(1);

fs.writeFileSync("slur-list-composite-txt", expression, "utf-8");

console.log(expression);
