const { EmbedBuilder } = require("discord.js");
const supabase = require("../events/supabaseClient.js"); // adjust path accordingly

module.exports = {
  name: "profile",
  description: "View profile.",
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild ? message.guild.members.cache.get(target.id) : null;

    // Fetch user data from Supabase table (assume table name is 'users')
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", target.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
      console.error("Supabase error:", error);
      return message.channel.send("Sorry, something went wrong fetching the profile.");
    }

    const roblox = userData?.roblox ?? "Not verified";
    const style = userData?.style ?? "No style selected";

    const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`;
    const joinedAt = member
      ? `<t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:f>`
      : "Not in this server";

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

    return message.channel.send({ embeds: [embed] });
  },
};
