const { EmbedBuilder } = require("discord.js");
const { supabase } = require("../utils");

// Import userKeywords from getkeyword
const { userKeywords } = require("./getkeyword");

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

async function getUserDescription(userId) {
  const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.description || "";
}

module.exports = {
  name: "verifyroblox",
  description: "Verify your Discord with your Roblox username and your unique keyword.",
  async execute(message, argsString) {
    if (!message.guild) {
      return message.channel.send("❌ This command can only be used in a server.");
    }

    const username = argsString.trim();
    if (!username) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Usage Error")
            .setDescription("❗ Usage: `!verifyroblox <roblox_username>`")
            .setTimestamp(),
        ],
      });
    }

    // Check if user has a generated keyword
    const keyword = userKeywords[message.author.id];
    if (!keyword) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("No Verification Keyword")
            .setDescription("❗ You need to generate a verification keyword first by using `!getkeyword`.")
            .setTimestamp(),
        ],
      });
    }

    const robloxUserId = await getUserId(username);
    if (!robloxUserId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Roblox User Not Found")
            .setDescription(`❌ The Roblox username **${username}** does not exist.`)
            .setTimestamp(),
        ],
      });
    }

    const description = await getUserDescription(robloxUserId);
    if (description === null) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Roblox API Error")
            .setDescription("❌ Could not fetch Roblox profile info. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

    if (!description.toLowerCase().includes(keyword.toLowerCase())) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Verification Failed")
            .setDescription(
              `❌ Your Roblox profile's About Me does not include your unique verification keyword:\n\n\`${keyword}\``
            )
            .setTimestamp(),
        ],
      });
    }

    const now = new Date().toISOString().replace("T", " ").replace("Z", "");
    const discordUserId = message.author.id;
    const { username: discordUsername, discriminator } = message.author;

    const { error } = await supabase
      .from("users")
      .upsert(
        {
          id: discordUserId,
          roblox: username,
          username: discordUsername,
          discriminator,
          updated_at: now,
          created_at: now,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Supabase upsert error:", error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Database Error")
            .setDescription("❌ Failed to save your Roblox username. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

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

    try {
      const member = await message.guild.members.fetch(discordUserId);
      if (!member.roles.cache.has(verifiedRole.id)) {
        await member.roles.add(verifiedRole);
      }
    } catch (err) {
      console.error("Error adding role:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Could not assign Verified role. Please check my permissions.")
            .setTimestamp(),
        ],
      });
    }

    // Remove stored keyword after success
    delete userKeywords[message.author.id];

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("Verification Successful")
          .setDescription(`✅ You are now verified as **${username}**.`)
          .setTimestamp(),
      ],
    });
  },
};
