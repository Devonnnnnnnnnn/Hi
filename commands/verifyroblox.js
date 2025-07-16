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
    const [username] = argsString.split(" ").filter((s) => s);
    if (!username) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Usage Error")
        .setDescription("❗ Usage: `!verifyroblox <username>`")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    const member = message.guild.members.cache.get(message.author.id);
    const verifiedRole = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "verified"
    );
    if (!verifiedRole) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Role Not Found")
        .setDescription("❗ Verified role not found in this server.")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    if (member.roles.cache.has(verifiedRole.id)) {
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Already Verified")
        .setDescription("✅ You’re already verified.")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    verifiedUsers[message.author.id] = username;
    try {
      fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 2));
    } catch (err) {
      console.error("Failed to save verified users:", err);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Error")
        .setDescription("❌ Failed to save verification. Please try again later.")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    try {
      await member.roles.add(verifiedRole);
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Verification Successful")
        .setDescription(`✅ Verified as **${username}**.`)
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to assign role:", err);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Role Assignment Failed")
        .setDescription("❌ Failed to assign the verified role. Please contact an admin.")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }
  },
};
