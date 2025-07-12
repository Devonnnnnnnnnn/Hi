const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "..", "users.json"); // go up 1 level

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read users.json:", error);
    return {};
  }
}

function saveUsers(usersData) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write users.json:", error);
  }
}

module.exports = {
  readUsers,
  saveUsers,
};