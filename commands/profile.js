const { EmbedBuilder } = require("discord.js");
const { supabase } = require("../utils.js"); // Adjust path if utils.js is elsewhere

module.exports = {
  name: "profile",
  description: "View profile.",
  async execute(message) {
    // Target user: either mentioned user or the message author
    const target = message.mentions.users.first() || message.author;
    const member = message.guild ? message.guild.members.cache.get(target.id) : null;

    // Fetch user data from Supabase 'users' table
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", target.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found (ignore this)
      console.error("Supabase error:", error);
      return message.channel.send("Sorry, something went wrong fetching the profile.");
    }

    // Default values if no data found
    const roblox = userData?.roblox ?? "Not verified";
    const style = userData?.style ?? "No style selected";

    // Format timestamps
    const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`;
    const joinedAt = member
      ? `<t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:f>`
      : "Not in this server";

    // Build embed message
    const embed = new EmbedBuilder()
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
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

    // Send the embed in the channel
    return message.channel.send({ embeds: [embed] });
  },
};
