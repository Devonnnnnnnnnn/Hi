const { EmbedBuilder } = require("discord.js");
const styleInfo = require("../data/styleInfo.js");

const MAX_FIELD_LENGTH = 1024; // Discord max field value length
const MAX_EMBED_FIELDS = 25; // Discord max fields per embed

module.exports = {
  name: "list",
  description: "List all styles.",
  async execute(message) {
    const styles = Object.keys(styleInfo).sort();

    // Helper to create a new embed with base properties
    function createEmbed(index) {
      return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`📋 Styles List${index > 1 ? ` (Page ${index})` : ""}`);
    }

    let embeds = [];
    let embed = createEmbed(1);

    let chunk = [];
    let chunkLength = 0;
    let fieldCount = 0;
    let embedCount = 1;

    for (const style of styles) {
      // Length of this style with comma + space (if not first in chunk)
      const toAdd = (chunk.length ? ", " : "") + style;

      if (chunkLength + toAdd.length > MAX_FIELD_LENGTH || fieldCount >= MAX_EMBED_FIELDS) {
        // Add current chunk as a field
        embed.addFields({
          name: "\u200B",
          value: chunk.join(", "),
          inline: false,
        });

        // If field limit reached, start new embed
        if (fieldCount >= MAX_EMBED_FIELDS) {
          embeds.push(embed);
          embedCount++;
          embed = createEmbed(embedCount);
          fieldCount = 0;
        }

        // Start new chunk with current style
        chunk = [style];
        chunkLength = style.length;
        fieldCount++;
      } else {
        chunk.push(style);
        chunkLength += toAdd.length;
      }
    }

    // Add remaining chunk
    if (chunk.length) {
      embed.addFields({
        name: "\u200B",
        value: chunk.join(", "),
        inline: false,
      });
      embeds.push(embed);
    } else if (!embeds.length) {
      // In case no fields added at all, still push empty embed (very unlikely)
      embeds.push(embed);
    }

    // Send all embeds sequentially
    for (const e of embeds) {
      await message.channel.send({ embeds: [e] });
    }
  },
};
