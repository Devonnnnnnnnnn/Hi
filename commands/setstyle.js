const fs = require("fs");
const path = require("path");
const styleStats = require("../data/styleStats.js");

const styleDataPath = path.join(__dirname, "..", "info", "styleInfo.js");
let styleData = {};
try {
  styleData = JSON.parse(fs.readFileSync(styleDataPath, "utf8"));
} catch {
  styleData = {};
}

module.exports = {
  name: "setstyle",
  description: "Set your style.",
  async execute(message, argsString) {
    if (!argsString) return message.channel.send("❗ Usage: `!setstyle <style>`");

    const input = argsString.toLowerCase();
    const key = Object.keys(styleStats).find((k) => k.toLowerCase() === input);
    if (!key) return message.channel.send("❌ Style not found.");

    styleData[message.author.id] = key;
    fs.writeFileSync(styleDataPath, JSON.stringify(styleData, null, 2));

    return message.channel.send(`✅ Your style has been set to **${key}**.`);
  },
};
