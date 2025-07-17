const { EmbedBuilder } = require('discord.js');
const styleInfo = require('../data/styleInfo.js');
const abilityInfo = require('../data/abilityInfo.js');

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get full info about a style or ability by name.",

  async execute(message, args) {
    const query = Array.isArray(args)
      ? args.join(" ").trim().toLowerCase()
      : String(args || "").trim().toLowerCase();

    if (!query) {
      return message.channel.send("❗ Usage: `!info <style/ability>`");
    }

    const styleKeys = Object.keys(styleInfo);
    const abilityKeys = Object.keys(abilityInfo);

    const styleExact = styleKeys.find(k => k.toLowerCase() === query);
    const abilityExact = abilityKeys.find(k => k.toLowerCase() === query);

    const stylePartial = styleKeys.filter(k => k.toLowerCase().includes(query));
    const abilityPartial = abilityKeys.filter(k => k.toLowerCase().includes(query));

    const embed = new EmbedBuilder()
      .setColor('#5865F2') // Discord blurple
      .setTimestamp();

    if (styleExact) {
      const description = styleInfo[styleExact];
      embed
        .setTitle(`🌀 Style: ${styleExact}`)
        .setDescription(description.length > 2048 ? description.slice(0, 2045) + "..." : description);

      return message.channel.send({ embeds: [embed] });
    }

    if (abilityExact) {
      const ability = abilityInfo[abilityExact];
      const description = abilityInfo[abilityExact] || "No description available.";

      embed
        .setTitle(`⚡ Ability: ${abilityExact}`)
        .setDescription(description.length > 2048 ? description.slice(0, 2045) + "..." : description);

      return message.channel.send({ embeds: [embed] });
    }

    if (stylePartial.length > 0 || abilityPartial.length > 0) {
      let desc = '';

      if (stylePartial.length > 0) {
        desc += `🌀 **Style matches:**\n${stylePartial.map(s => `\`${s}\``).join(', ')}\n\n`;
      }

      if (abilityPartial.length > 0) {
        desc += `⚡ **Ability matches:**\n${abilityPartial.map(a => `\`${a}\``).join(', ')}\n\n`;
      }

      embed
        .setTitle('🔍 Partial matches found')
        .setDescription(desc.trim());

      return message.channel.send({ embeds: [embed] });
    }

    embed
      .setTitle('❌ No matches found')
      .setDescription('No matching style or ability found.');

    return message.channel.send({ embeds: [embed] });
  },
};
