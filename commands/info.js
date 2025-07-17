const { EmbedBuilder } = require('discord.js');
const styleInfo = require('../data/styleInfo.js');
const abilityInfo = require('../data/abilityInfo.js');

module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get full info about a style or ability by name.",

  async execute(message, args, adminIDs) {
    const query = Array.isArray(args)
      ? args.join(" ").trim().toLowerCase()
      : String(args).trim().toLowerCase();

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
      .setTimestamp();

    // Exact match: Style
    if (styleExact) {
      const data = styleInfo[styleExact];

      embed.setTitle(`🌀 Style: ${styleExact}`);

      if (data.description) embed.setDescription(data.description);

      // If stats present, add them in a neat field
      if (data.stats && typeof data.stats === 'object') {
        const statsText = Object.entries(data.stats)
          .map(([key, val]) => `**${key.charAt(0).toUpperCase() + key.slice(1)}:** ${val}`)
          .join('\n');
        embed.addFields({ name: 'Stats', value: statsText, inline: true });
      }

      // If abilities array present, list them
      if (Array.isArray(data.abilities) && data.abilities.length > 0) {
        embed.addFields({
          name: 'Abilities',
          value: data.abilities.map(a => `• ${a}`).join('\n'),
          inline: false,
        });
      }

      return message.channel.send({ embeds: [embed] });
    }

    // Exact match: Ability
    if (abilityExact) {
      const data = abilityInfo[abilityExact];

      embed.setTitle(`⚡ Ability: ${abilityExact}`);

      if (data.description) embed.setDescription(data.description);

      // Show cooldown or other fields if available
      if (data.cooldown) {
        embed.addFields({ name: 'Cooldown', value: data.cooldown, inline: true });
      }

      if (data.effect) {
        embed.addFields({ name: 'Effect', value: data.effect, inline: false });
      }

      // Add any other keys (except description, cooldown, effect) as additional fields
      for (const [key, value] of Object.entries(data)) {
        if (!['description', 'cooldown', 'effect'].includes(key) && value) {
          embed.addFields({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(value),
            inline: true,
          });
        }
      }

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

      embed.setTitle('🔍 Partial matches found');
      embed.setDescription(desc.trim());
      return message.channel.send({ embeds: [embed] });
    }

    // No matches
    embed.setTitle('❌ No matches found');
    embed.setDescription('No matching style or ability found.');
    return message.channel.send({ embeds: [embed] });
  },
};
