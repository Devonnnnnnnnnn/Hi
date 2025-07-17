const { EmbedBuilder } = require('discord.js');
const styleInfo = require('../data/styleInfo.js');
const abilityInfo = require('../data/abilityInfo.js');

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get full info about a style or ability by name.",

  async execute(message, args, adminIDs) {
    const query = Array.isArray(args) ? args.join(" ").trim().toLowerCase() : String(args).trim().toLowerCase();

    if (!query)
      return message.channel.send("❗ Usage: `!info <style/ability>`");

    // Search for exact and partial matches
    const styleKeys = Object.keys(styleInfo);
    const styleExact = styleKeys.find(k => k.toLowerCase() === query);
    const stylePartial = styleKeys.filter(k => k.toLowerCase().includes(query));

    const abilityKeys = Object.keys(abilityInfo);
    const abilityExact = abilityKeys.find(k => k.toLowerCase() === query);
    const abilityPartial = abilityKeys.filter(k => k.toLowerCase().includes(query));

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🔍 Info Lookup')
      .setTimestamp();

    // Exact match: Style
    if (styleExact) {
      const data = styleInfo[styleExact];
      const valueText = typeof data === 'object'
        ? JSON.stringify(data, null, 2)
        : String(data);

      embed.setTitle(`🌀 Style: ${styleExact}`);
      embed.setDescription(`\`\`\`json\n${valueText}\n\`\`\``);
      return message.channel.send({ embeds: [embed] });
    }

    // Exact match: Ability
    if (abilityExact) {
      const data = abilityInfo[abilityExact];
      const valueText = typeof data === 'object'
        ? JSON.stringify(data, null, 2)
        : String(data);

      embed.setTitle(`⚡ Ability: ${abilityExact}`);
      embed.setDescription(`\`\`\`json\n${valueText}\n\`\`\``);
      return message.channel.send({ embeds: [embed] });
    }

    // Partial matches
    if (stylePartial.length > 0 || abilityPartial.length > 0) {
      let desc = '';

      if (stylePartial.length > 0) {
        desc += `🌀 **Style matches:**\n${stylePartial.map(s => `\`${s}\``).join(', ')}\n\n`;
      }

      if (abilityPartial.length > 0) {
        desc += `⚡ **Ability matches:**\n${abilityPartial.map(a => `\`${a}\``).join(', ')}\n\n`;
      }

      embed.setDescription(desc.trim());
      return message.channel.send({ embeds: [embed] });
    }

    // No matches
    embed.setDescription('❌ No matching style or ability found.');
    return message.channel.send({ embeds: [embed] });
  },
};
