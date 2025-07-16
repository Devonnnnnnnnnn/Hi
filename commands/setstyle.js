const fs = require("fs");
const path = require("path");
const styleStats = require("../data/styleInfo.js"); // Import style definitions

const userStylesPath = path.join(__dirname, "..", "data", "userStyles.json");

// Load user styles from file, or initialize empty object
let userStyles = {};
try {
  userStyles = JSON.parse(fs.readFileSync(userStylesPath, "utf8"));
} catch {
  userStyles = {};
}

module.exports = {
  name: "setstyle",
  description: "Set your style.",
  async execute(message, argsString) {
    if (!argsString) {
      return message.channel.send("❗ Usage: `!setstyle <style>`");
    }

    const input = argsString.toLowerCase();
    // Find a style key case-insensitive
    const key = Object.keys(styleStats).find(k => k.toLowerCase() === input);
    if (!key) {
      return message.channel.send("❌ Style not found. Available styles:\n" + Object.keys(styleStats).join(", "));
    }

    // Save user's style choice
    userStyles[message.author.id] = key;
    try {
      fs.writeFileSync(userStylesPath, JSON.stringify(userStyles, null, 2));
    } catch (err) {
      console.error("Failed to save user styles:", err);
      return message.channel.send("❌ Could not save your style. Please try again later.");
    }

    return message.channel.send(`✅ Your style has been set to **${key}**.`);
  },
};
