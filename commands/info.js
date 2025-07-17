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
      : String(args).trim().toLowerCase();

    if (!query)
      return message.channel.send("❗ Usage: `!info <style/ability>`");

    const styleKeys = Object.keys(styleInfo);
    const abilityKeys = Object.keys(abilityInfo);

    const styleExact = styleKeys.find(k => k.toLowerCase() === query);
    const abilityExact = abilityKeys.find(k => k.toLowerCase() === query);

    const stylePartial = styleKeys.filter(k => k.toLowerCase().includes(query));
    const abilityPartial = abilityKeys.filter(k => k.toLowerCase().includes(query));

    const embed = new EmbedBuilder()
      .setColor('#5865F2') // Discord blurple color
      .setTimestamp();

    if (styleExact) {
      const data = styleInfo[styleExact];

      embed.setTitle(`🌀 Style: ${styleExact}`);

      // Description
      embed.setDescription(data.description || "No description available.");

      // Stats section (human-friendly)
      if (data.stats && typeof data.stats === 'object') {
        let statsText = '';
        for (const [stat, val] of Object.entries(data.stats)) {
          // add a little emoji flair by stat name
          let emoji = '⚙️'; // generic gear emoji fallback
          if (stat.toLowerCase().includes('speed')) emoji = '💨';
          else if (stat.toLowerCase().includes('power')) emoji = '💪';
          else if (stat.toLowerCase().includes('technique')) emoji = '🎯';

          statsText += `${emoji} **${stat.charAt(0).toUpperCase() + stat.slice(1)}:** ${val}\n`;
        }
        embed.addFields({ name: 'Stats', value: statsText, inline: false });
      }

      // Abilities as bullet points
      if (Array.isArray(data.abilities) && data.abilities.length > 0) {
        embed.addFields({
          name: 'Abilities',
          value: data.abilities.map(ability => `• ${ability}`).join('\n'),
          inline: false,
        });
      }

      return message.channel.send({ embeds: [embed] });
    }

    if (abilityExact) {
      const data = abilityInfo[abilityExact];

      embed.setTitle(`⚡ Ability: ${abilityExact}`);

      embed.setDescription(data.description || "No description available.");

      if (data.cooldown) {
        embed.addFields({ name: 'Cooldown ⏳', value: data.cooldown, inline: true });
      }

      if (data.effect) {
        embed.addFields({ name: 'Effect ✨', value: data.effect, inline: false });
      }

      // Show any other relevant fields nicely (excluding those above)
      for (const [key, val] of Object.entries(data)) {
        if (!['description', 'cooldown', 'effect'].includes(key) && val) {
          const title = key.charAt(0).toUpperCase() + key.slice(1);
          embed.addFields({ name: title, value: String(val), inline: true });
        }
      }

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
