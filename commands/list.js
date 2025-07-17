const { EmbedBuilder } = require("discord.js");
const styleInfo = require("../data/styleInfo.js");
const abilityInfo = require("../data/abilityInfo.js"); // your abilities data

module.exports = {
  name: "list",
  description: "List all styles and abilities.",
  async execute(message) {
    const styles = Object.keys(styleInfo);    // original order
    const abilities = Object.keys(abilityInfo);

    // Create one embed with two fields
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("📋 Styles and Abilities List")
      .addFields(
        {
          name: "🎯 Styles",
          value: styles.join(", ") || "No styles available.",
          inline: false,
        },
        {
          name: "⚡ Abilities",
          value: abilities.join(", ") || "No abilities available.",
          inline: false,
        }
      );

    await message.channel.send({ embeds: [embed] });
  },
};
