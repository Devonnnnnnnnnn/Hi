const fs = require("fs").promises;
const path = require("path");

const usersFilePath = path.join(__dirname, "..", "users.json");

async function readUsers() {
  try {
    const data = await fs.readFile(usersFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read users.json:", error);
    return {};
  }
}

async function saveUsers(usersData) {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write users.json:", error);
  }
}

module.exports = {
  readUsers,
  saveUsers,
};
