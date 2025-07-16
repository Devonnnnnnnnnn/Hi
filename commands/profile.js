const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "..", "data", "users.json");
let usersData = {};
try {
  usersData = JSON.parse(fs.readFileSync(usersPath, "utf8"));
} catch {
  usersData = {};
}

const verifiedUsersPath = path.join(__dirname, "..", "data", "verifiedUsers.json");
let verifiedUsers = {};
try {
  verifiedUsers = JSON.parse(fs.readFileSync(verifiedUsersPath, "utf8"));
} catch {
  verifiedUsers = {};
}

const { syncUserXP } = require("../utils.js");

module.exports = {
  name: "profile",
  description: "View profile.",
  async execute(message) {
    const target = message.mentions.users.first() || message.author;

    const roblox = verifiedUsers?.[target.id] ?? "Not verified";

    const userXP = usersData[target.id] || 0;
    const xpInfo = syncUserXP(userXP);

    const embed = new EmbedBuilder()
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
      .setDescription(`🏆 XP: **${xpInfo.xp}**\n🆙 Level: **${xpInfo.level}**`)
      .addFields(
        { name: "Roblox", value: roblox, inline: true },
        { name: "ID", value: target.id, inline: true }
      );

    return message.channel.send({ embeds: [embed] });
  },
};
