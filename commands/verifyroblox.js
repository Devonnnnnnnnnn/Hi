const fs = require("fs").promises;
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const usersPath = path.join(__dirname, "..", "data", "users.json");

// Load users on startup
let users = {};
(async () => {
  try {
    const data = await fs.readFile(usersPath, "utf8");
    users = JSON.parse(data);
  } catch {
    users = {};
  }
})();

// Generate a random keyword
function generateKeyword() {
  return "veri-" + Math.random().toString(36).substring(2, 10);
}

// Get Roblox user ID from username
async function getUserId(username) {
  const res = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username] }),
  });

  const data = await res.json();
  if (data && data.data && data.data.length > 0) {
    return data.data[0].id;
  }
  return null;
}

// Get Roblox "About Me" section
async function getUserDescription(userId) {
  const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
  const data = await res.json();
  return data.description || "";
}

module.exports = {
  name: "verifyroblox",
  description: "Verify via Roblox profile keyword.",
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

    const userId = message.author.id;

    // First-time check — generate keyword
    if (!users[userId] || users[userId].verified !== username) {
      const keyword = generateKeyword();
      users[userId] = {
        username,
        keyword,
        verified: false,
      };

      await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("Verification Step 1")
            .setDescription(`📋 Please copy this keyword:\n\`${keyword}\`\n\nPaste it into your **Roblox About Me** section. Once you've done that, run:\n\`!verifyroblox ${username}\` again to complete verification.`)
            .setTimestamp(),
        ],
      });
    }

    // Already verified?
    if (users[userId].verified === true) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Already Verified")
            .setDescription(`✅ You’re already verified as **${users[userId].username}**.`)
            .setTimestamp(),
        ],
      });
    }

    // Check About Me for keyword
    try {
      const robloxUserId = await getUserId(username);
      if (!robloxUserId) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("User Not Found")
              .setDescription("❌ Roblox user not found. Double-check the username.")
              .setTimestamp(),
          ],
        });
      }

      const description = await getUserDescription(robloxUserId);
      const keyword = users[userId].keyword;

      if (!description.includes(keyword)) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xffaa00)
              .setTitle("Keyword Not Found")
              .setDescription(`❌ Couldn’t find your keyword in your About Me. Please make sure you added:\n\`${keyword}\`\nto your Roblox profile, then try again.`)
              .setTimestamp(),
          ],
        });
      }

      // ✅ All good — assign role
      await member.roles.add(verifiedRole);
      users[userId].verified = true;

      await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Verification Successful")
            .setDescription(`✅ Verified as **${username}**.`)
            .setTimestamp(),
        ],
      });

    } catch (err) {
      console.error("Verification error:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Something went wrong during verification. Please try again later.")
            .setTimestamp(),
        ],
      });
    }
  },
};
