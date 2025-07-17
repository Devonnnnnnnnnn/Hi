const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const verifiedUsersPath = path.join(__dirname, "..", "data", "verifiedUsers.json");
let verifiedUsers = {};
try {
  verifiedUsers = JSON.parse(fs.readFileSync(verifiedUsersPath, "utf8"));
} catch {
  verifiedUsers = {};
}

module.exports = {
  name: "verifyroblox",
  description: "Verify via Roblox.",
  async execute(message, argsString) {
    if (!message.guild) {
      return message.channel.send("❌ This command can only be used in a server.");
    }

    const [username] = argsString.trim().split(/\s+/);
    if (!username) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Usage Error")
            .setDescription("❗ Usage: `!verifyroblox <username>`")
            .setTimestamp(),
        ],
      });
    }

    const member = message.guild.members.cache.get(message.author.id);
    const verifiedRole = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "verified"
    );
    if (!verifiedRole) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Role Not Found")
            .setDescription("❗ Verified role not found in this server.")
            .setTimestamp(),
        ],
      });
    }

    if (member.roles.cache.has(verifiedRole.id)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Already Verified")
            .setDescription("✅ You’re already verified.")
            .setTimestamp(),
        ],
      });
    }

    try {
      await member.roles.add(verifiedRole);
    } catch (err) {
      console.error("Failed to assign role:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Role Assignment Failed")
            .setDescription("❌ Failed to assign the verified role. Please contact an admin.")
            .setTimestamp(),
        ],
      });
    }

    verifiedUsers[message.author.id] = username;
    try {
      fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 2));
    } catch (err) {
      console.error("Failed to save verified users:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Failed to save verification. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("Verification Successful")
          .setDescription(`✅ Verified as **${username}**.`)
          .setTimestamp(),
      ],
    });
  },
};
