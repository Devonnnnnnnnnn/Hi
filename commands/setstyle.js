const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleInfo.js");
const supabase = require("../events/supabaseClient"); // Adjust path if needed

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
      // Update the user's style in the "users" table where id = author's Discord user ID
      const { data, error } = await supabase
        .from("users")
        .update({ style: key })
        .eq("id", author.id); // change "id" if your column name is different

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

      // If no rows were updated (user not found), inform them
      if (!data || data.length === 0) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("User Not Found")
              .setDescription(
                "❌ Your user record was not found in the database."
              )
              .setTimestamp(),
          ],
        });
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
