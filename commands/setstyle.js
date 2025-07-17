const fs = require("fs").promises;
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleInfo.js");

const userStylesPath = path.join(__dirname, "..", "data", "userStyles.json");

let userStyles = {};
(async () => {
  try {
    const data = await fs.readFile(userStylesPath, "utf8");
    userStyles = JSON.parse(data);
  } catch {
    userStyles = {};
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
                Object.keys(styleStats)
                  .map(s => `\`${s}\``)
                  .join(", ")
            )
            .setTimestamp(),
        ],
      });
    }

    userStyles[message.author.id] = key;
    try {
      await fs.writeFile(userStylesPath, JSON.stringify(userStyles, null, 2));
    } catch (err) {
      console.error("Failed to save user styles:", err);
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
