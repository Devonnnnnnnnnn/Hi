const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Show bot uptime.",
  async execute(message) {
    const totalSeconds = process.uptime();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const embed = new EmbedBuilder()
      .setTitle("⏱️ Bot Uptime")
      .setColor(0x00aeef)
      .setDescription(`**${hours}** hours, **${minutes}** minutes, **${seconds}** seconds`)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};

