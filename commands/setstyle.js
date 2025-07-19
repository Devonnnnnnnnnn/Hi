const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleInfo.js");
const { supabase } = require("../utils.js"); // Adjust path if needed

module.exports = {
  name: "setstyle",
  description: "Set your style.",
  /**
   * @param {import("discord.js").Message} message
   * @param {string} argsString
   */
  async execute(message, argsString) {
    const { author, channel } = message;

    if (!argsString) {
      return channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Usage Error")
            .setDescription("❗ Usage: `!setstyle <style>`")
            .setTimestamp(),
        ],
      });
    }

    const input = argsString.trim().toLowerCase();
    const key = Object.keys(styleStats).find(
      (k) => k.toLowerCase() === input
    );

    if (!key) {
      return channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Style Not Found")
            .setDescription(
              `❌ Style "**${argsString}**" not found.\n` +
                `Available styles:\n` +
                Object.keys(styleStats)
                  .map((s) => `\`${s}\``)
                  .join(", ")
            )
            .setTimestamp(),
        ],
      });
    }

    try {
      // Try to update user's style
      const { data, error } = await supabase
        .from("users")
        .update({ style: key })
        .eq("id", author.id)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("Error")
              .setDescription("❌ Could not save your style. Please try again later.")
              .setTimestamp(),
          ],
        });
      }

      if (!data || data.length === 0) {
        // User doesn't exist — insert with required fields
        const { id, username, discriminator } = author;

        const { data: insertData, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id,
              username,
              discriminator,
              style: key,
            },
          ]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          return channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("Insert Error")
                .setDescription("❌ Failed to create your user record.")
                .setTimestamp(),
            ],
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Error")
            .setDescription("❌ Could not save your style. Please try again later.")
            .setTimestamp(),
        ],
      });
    }

    return channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("Style Set")
          .setDescription(`✅ Your style has been set to **${key}**.`)
          .setTimestamp(),
      ],
    });
  },
};
