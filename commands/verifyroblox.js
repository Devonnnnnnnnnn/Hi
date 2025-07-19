const { EmbedBuilder } = require("discord.js");
const { supabase } = require("../utils.js"); // adjust path as needed

function generateKeyword() {
  return "veri-" + Math.random().toString(36).substring(2, 10);
}

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
  const data = await res.json();
  return data.description || "";
}

module.exports = {
  name: "verifyroblox",
  description: "Verify via Roblox profile keyword.",
  /**
   * @param {import("discord.js").Message} message
   * @param {string} argsString
   */
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

    let member;
    try {
      member = await message.guild.members.fetch(message.author.id);
    } catch {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Could not fetch your member info. Please try again.")
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

    const discordUserId = message.author.id;

    // Fetch verification record from Supabase
    let { data: record, error } = await supabase
      .from("roblox_verifications")
      .select("*")
      .eq("discord_user_id", discordUserId)
      .single();

    if (error && error.code !== "PGRST116") { // ignore "no rows" error
      console.error("Supabase fetch error:", error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Database Error")
            .setDescription("❌ Could not access verification data. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

    // If no record or username changed -> create new record with new keyword
    if (!record || record.username !== username) {
      const keyword = generateKeyword();

      const { data, error: upsertError } = await supabase
        .from("roblox_verifications")
        .upsert({
          discord_user_id: discordUserId,
          username,
          keyword,
          verified: false,
        }, { onConflict: "discord_user_id" });

      if (upsertError) {
        console.error("Supabase upsert error:", upsertError);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("Database Error")
              .setDescription("❌ Failed to save verification data. Please try again later.")
              .setTimestamp(),
          ],
        });
      }

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

    if (record.verified) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Already Verified")
            .setDescription(`✅ You’re already verified as **${record.username}**.`)
            .setTimestamp(),
        ],
      });
    }

    // Check Roblox about me for keyword
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
      const keyword = record.keyword;

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

      await member.roles.add(verifiedRole);

      // Update verification status
      const { error: updateError } = await supabase
        .from("roblox_verifications")
        .update({ verified: true })
        .eq("discord_user_id", discordUserId);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("Database Error")
              .setDescription("❌ Failed to update verification status. Please try again later.")
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
