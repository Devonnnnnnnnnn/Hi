const { EmbedBuilder } = require("discord.js");
const styleInfo = require("../data/styleInfo.js");
const abilityInfo = require("../data/abilityInfo.js");

function chunkArray(arr, maxLen) {
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const item of arr) {
    const itemLen = item.length + 2; // account for ", "
    if (currentLength + itemLen > maxLen) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(item);
    currentLength += itemLen;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

module.exports = {
  name: "list",
  description: "List all styles and abilities.",
  async execute(message) {
    const styles = Object.keys(styleInfo);
    const abilities = Object.keys(abilityInfo);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("📋 Styles and Abilities List");

    // Chunk styles if too long
    const styleChunks = chunkArray(styles, 1000); // keep under 1024 limit
    for (let i = 0; i < styleChunks.length; i++) {
      embed.addFields([
        {
          name: i === 0 ? "🎯 Styles" : `🎯 Styles (cont. ${i})`,
          value: styleChunks[i].join(", "),
          inline: false,
        },
      ]);
    }

    // Chunk abilities if too long
    const abilityChunks = chunkArray(abilities, 1000);
    for (let i = 0; i < abilityChunks.length; i++) {
      embed.addFields([
        {
          name: i === 0 ? "⚡ Abilities" : `⚡ Abilities (cont. ${i})`,
          value: abilityChunks[i].join(", "),
          inline: false,
        },
      ]);
    }

    await message.channel.send({ embeds: [embed] });
  },
};
