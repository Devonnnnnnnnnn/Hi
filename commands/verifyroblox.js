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
  name: "verifyroblox",
  description: "Verify via Roblox.",
  async execute(message, argsString) {
    const [username] = argsString.split(" ").filter((s) => s);
    if (!username)
      return message.channel.send("❗ Usage: `!verifyroblox <username>`");

    const member = message.guild.members.cache.get(message.author.id);
    const verifiedRole = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "verified",
    );
    if (!verifiedRole)
      return message.channel.send("❗ Verified role not found.");
    if (member.roles.cache.has(verifiedRole.id))
      return message.channel.send("✅ You’re already verified.");

    verifiedUsers[message.author.id] = username;
    fs.writeFileSync(verifiedUsersPath, JSON.stringify(verifiedUsers, null, 2));

    try {
      await member.roles.add(verifiedRole);
      return message.channel.send(`✅ Verified as **${username}**.`);
    } catch {
      return message.channel.send("❌ Failed to assign role.");
    }
  },
};
