const { EmbedBuilder } = require('discord.js');
const styleInfo = require('../data/styleInfo.js');
const abilityInfo = require('../data/abilityInfo.js');

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get the key name of a style or ability using partial or full input.",
  
  async execute(message, args, adminIDs) {
    // Normalize input: join array or convert to string
    const query = Array.isArray(args) ? args.join(" ").trim().toLowerCase() : String(args).trim().toLowerCase();

    if (!query)
      return message.channel.send("❗ Usage: `!info <style/ability>`");

    // Search for style matches
    const styleKeys = Object.keys(styleInfo);
    const styleExact = styleKeys.find(k => k.toLowerCase() === query);
    const stylePartial = styleKeys.filter(k => k.toLowerCase().includes(query));

    // Search for ability matches
    const abilityKeys = Object.keys(abilityInfo);
    const abilityExact = abilityKeys.find(k => k.toLowerCase() === query);
    const abilityPartial = abilityKeys.filter(k => k.toLowerCase().includes(query));

    // Create base embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🔍 Info Lookup')
      .setTimestamp();

    // Exact match output
    if (styleExact) {
      embed.setDescription(`📝 **Style:** \`${styleExact}\``);
      return message.channel.send({ embeds: [embed] });
    }

    if (abilityExact) {
      embed.setDescription(`📝 **Ability:** \`${abilityExact}\``);
      return message.channel.send({ embeds: [embed] });
    }

    // Partial match output
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
