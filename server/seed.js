const fs = require("fs");
const path = require("path");
const generate = require("fake-todos");

const todos = generate(10000).map((item, index) => ({
  id: index,
  title: item.what,
  completed: item.done,
}));

fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify({ todos }));
