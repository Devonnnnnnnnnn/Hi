const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleInfo.js");
const { supabase } = require("../utils.js");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
  name: "setstyle",
  description: "Set your style.",
  /**
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    const { author, channel } = message;

    if (!args.length) {
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

    // Join args array into a single string (in case style has spaces)
    const input = args.join(" ").trim().toLowerCase();

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
              `❌ Style "**${input}**" not found.\n` +
              `Available styles:\n` +
              Object.keys(styleStats)
                .map((s) => `\`${s}\``)
                .join(", ")
            )
            .setTimestamp(),
        ],
      });
    }

    const now = dayjs().tz("Etc/GMT-2").format("YYYY-MM-DD HH:mm:ss");

    try {
      const { data, error } = await supabase
        .from("users")
        .update({ style: key, updated_at: now, discriminator: author.discriminator })
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
        const { error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: author.id,
              discriminator: author.discriminator,
              style: key,
              created_at: now,
              updated_at: now,
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
