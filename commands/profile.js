const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "..", "data", "users.json");

let users = {};
try {
  users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
} catch {
  users = {};
}

module.exports = {
  name: "profile",
  description: "View profile.",
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild ? message.guild.members.cache.get(target.id) : null;

    const userData = users[target.id] || {};
    const roblox = userData.roblox ?? "Not verified";
    const style = userData.style ?? "No style selected";

    const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`;
    const joinedAt = member
      ? `<t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:f>`
      : "Not in this server";

    const embed = new EmbedBuilder()
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(target.displayAvatarURL({ dynamic: true }) )
      .addFields(
        { name: "Roblox", value: roblox, inline: true },
        { name: "Style", value: style, inline: true },
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
