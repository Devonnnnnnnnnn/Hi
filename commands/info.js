const { EmbedBuilder } = require("discord.js");
const styleInfo = require("../data/styleInfo.js");
const abilityInfo = require("../data/abilityInfo.js");
const styleStats = require("../data/styleStats.js");

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get info on style or ability.",
  async execute(message, argsString) {
    if (!argsString) return message.channel.send("❗ Usage: `!info <style/ability>`");

    const q = argsString.toLowerCase();
    const sk = Object.keys(styleInfo).find(
      (k) => k.toLowerCase() === q || k.toLowerCase().includes(q),
    );
    const ak = Object.keys(abilityInfo).find(
      (k) => k.toLowerCase() === q || k.toLowerCase().includes(q),
    );

    if (!sk && !ak)
      return message.channel.send("❌ No matching style or ability.");

    const embed = new EmbedBuilder().setColor(0x0099ff);
    if (sk) {
      embed
        .setTitle(`📝 Style: ${sk}`)
        .setDescription(styleInfo[sk])
        .addFields({
          name: "Technique Score",
          value: styleStats[sk]?.toString() ?? "Unknown",
        });
    } else {
      embed.setTitle(`📝 Ability: ${ak}`).setDescription(abilityInfo[ak]);
    }
    return message.channel.send({ embeds: [embed] });
  },
};
