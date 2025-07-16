const { EmbedBuilder } = require('discord.js');
const styleInfo = require('../data/styleInfo.js');
const abilityInfo = require('../data/abilityInfo.js');

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get style or ability key name only.",
  async execute(message, argsString) {
    if (!argsString) 
      return message.channel.send("❗ Usage: `!info <style/ability>`");

    const query = argsString.toLowerCase();

    // Find exact or substring matches for styles
    const styleKeys = Object.keys(styleInfo);
    const styleExact = styleKeys.find(k => k.toLowerCase() === query);
    const stylePartial = styleKeys.filter(k => k.toLowerCase().includes(query));

    // Find exact or substring matches for abilities
    const abilityKeys = Object.keys(abilityInfo);
    const abilityExact = abilityKeys.find(k => k.toLowerCase() === query);
    const abilityPartial = abilityKeys.filter(k => k.toLowerCase().includes(query));

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🔍 Info Lookup')
      .setTimestamp();

    if (styleExact) {
      embed.setDescription(`📝 **Style:** \`${styleExact}\``);
      return message.channel.send({ embeds: [embed] });
    }

    if (abilityExact) {
      embed.setDescription(`📝 **Ability:** \`${abilityExact}\``);
      return message.channel.send({ embeds: [embed] });
    }

    // No exact match — show partial matches or no result
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

    // No matches found
    embed.setDescription('❌ No matching style or ability found.');
    return message.channel.send({ embeds: [embed] });
  },
};
