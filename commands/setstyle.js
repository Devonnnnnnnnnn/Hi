const fs = require("fs").promises;
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleInfo.js");

const usersPath = path.join(__dirname, "..", "data", "users.json");

// Load users.json on startup
let users = {};
(async () => {
  try {
    const data = await fs.readFile(usersPath, "utf8");
    users = JSON.parse(data);
  } catch {
    users = {};
  }
})();

module.exports = {
  name: "setstyle",
  description: "Set your style.",
  async execute(message, argsString) {
    if (!argsString) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Usage Error")
            .setDescription("❗ Usage: `!setstyle <style>`")
            .setTimestamp(),
        ],
      });
    }

    const input = argsString.trim().toLowerCase();
    const key = Object.keys(styleStats).find(k => k.toLowerCase() === input);

    if (!key) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Style Not Found")
            .setDescription(
              `❌ Style "**${argsString}**" not found.\n` +
              `Available styles:\n` +
              Object.keys(styleStats).map(s => `\`${s}\``).join(", ")
            )
            .setTimestamp(),
        ],
      });
    }

    const userId = message.author.id;

    // Ensure user entry exists
    if (!users[userId]) {
      users[userId] = {};
    }

    // Set the user's style
    users[userId].style = key;

    try {
      await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error("Failed to save users.json:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Could not save your style. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("Style Set")
          .setDescription(`✅ Your style has been set to **${key}**.`)
          .setTimestamp(),
      ],
    });
  },
};
