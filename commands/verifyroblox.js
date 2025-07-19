const { EmbedBuilder } = require("discord.js");
const { supabase } = require("../utils");

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

module.exports = {
  name: "verifyroblox",
  description: "Verify your Discord with your Roblox username.",
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

    // Check Roblox user exists
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

    // Prepare timestamps in timestamp without 'Z' format
    const now = new Date().toISOString().replace("T", " ").replace("Z", "");

    // Upsert user record in Supabase with Discord info & timestamps
    const discordUserId = message.author.id;
    const { username: discordUsername, discriminator } = message.author;

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: discordUserId,
          roblox: username,
          username: discordUsername,
          discriminator: discriminator,
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

    // Add verified role
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

    // Success message
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
