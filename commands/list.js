const { EmbedBuilder } = require("discord.js");
const styleStats = require("../data/styleStats.js");

module.exports = {
  name: "list",
  description: "List all styles.",
  async execute(message) {
    const styles = Object.keys(styleStats).sort();

    const embed = new EmbedBuilder().setColor(0x0099ff).setTitle("📋 Styles List");

    const maxFieldLength = 1024; // Discord max field value length

    // Split styles into chunks that fit into embed fields
    let chunk = [];
    let chunkLength = 0;

    for (const style of styles) {
      const toAdd = (chunk.length ? ", " : "") + style;
      if (chunkLength + toAdd.length > maxFieldLength) {
        embed.addFields({
          name: "\u200B", // empty field name
          value: chunk.join(", "),
          inline: false,
        });
        chunk = [style];
        chunkLength = style.length;
      } else {
        chunk.push(style);
        chunkLength += toAdd.length;
      }
    }

    // Add the last chunk
    if (chunk.length) {
      embed.addFields({
        name: "\u200B",
        value: chunk.join(", "),
        inline: false,
      });
    }

    return message.channel.send({ embeds: [embed] });
  },
};
