const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const verifiedUsersPath = path.join(__dirname, "..", "data", "verifiedUsers.json");
let verifiedUsers = {};
try {
  verifiedUsers = JSON.parse(fs.readFileSync(verifiedUsersPath, "utf8"));
} catch {
  verifiedUsers = {};
}

module.exports = {
  name: "profile",
  description: "View profile.",
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(target.id);

    const roblox = verifiedUsers?.[target.id] ?? "Not verified";

    const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`;
    const joinedAt = member
      ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`
      : "Not in this server";

    const embed = new EmbedBuilder()
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "Roblox", value: roblox, inline: true },
        { name: "Discord ID", value: target.id, inline: true },
        { name: "Account Created", value: createdAt, inline: true },
        { name: "Joined Server", value: joinedAt, inline: true },
        { name: "Bot?", value: target.bot ? "Yes 🤖" : "No", inline: true }
      )
      .setColor(0x00AE86)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
