const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "Tickets.json");

function getData() {
  if (!fs.existsSync(filePath)) return [];
  const json = fs.readFileSync(filePath, "utf8");
  return JSON.parse(json);
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { getData, saveData };
