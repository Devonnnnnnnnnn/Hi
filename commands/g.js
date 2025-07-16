const fs = require('fs');
const { DateTime } = require('luxon');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const giveawayPath = './giveaways.json';
let giveawayInfo = {};

// Load giveaways from file on start
if (fs.existsSync(giveawayPath)) {
  giveawayInfo = JSON.parse(fs.readFileSync(giveawayPath, 'utf-8'));
}

function saveGiveaways() {
  fs.writeFileSync(giveawayPath, JSON.stringify(giveawayInfo, null, 2));
}

function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return { seconds: value };
    case 'm': return { minutes: value };
    case 'h': return { hours: value };
    case 'd': return { days: value };
    default: return null;
  }
}

function parseArgs(args) {
  const joined = args.join(' ');
  const parts = joined.match(/(?:[^,"]+|"[^"]*")+/g);
  if (!parts || parts.length < 3) return null;
  return parts.slice(0, 3).map(p => p.trim().replace(/^"|"$/g, ''));
}

module.exports = {
  name: 'g',
  description: 'Create a giveaway (Admin only)',
  async execute(message, args, adminIDs) {
    if (!adminIDs.includes(message.author.id)) {
      return message.channel.send("❌ You don’t have permission to use this command.");
    }

    const parsed = parseArgs(args);
    if (!parsed) {
      return message.channel.send("❗ Usage: `!g <name>, <prize>, <duration>`\nExample: `!g \"Super Giveaway\", Nitro, 1h`");
    }

    const [name, prize, durationStr] = parsed;

    const duration = parseDuration(durationStr);
    if (!duration) {
      return message.channel.send("❌ Use a valid duration like `10m`, `2h`, or `1d`.");
    }

    if (Object.values(giveawayInfo).some(gw => gw.name.toLowerCase() === name.toLowerCase())) {
      return message.channel.send("⚠️ A giveaway with this name already exists. Please choose a different name.");
    }

    const endsAt = DateTime.now().plus(duration);
    const id = generateId();

    const embed = new EmbedBuilder()
      .setTitle(`🎁 Giveaway: ${name}`)
      .setDescription(
        `🎉 **Prize:** ${prize}\n` +
        `🕒 **Ends at:** <t:${Math.floor(endsAt.toSeconds())}:F>\n\n` +
        `Use the buttons below to enter or leave the giveaway!\n` +
        `🔑 **Giveaway ID:** \`${id}\``
      )
      .setColor('#FFD700')
      .setFooter({ text: `Hosted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`giveaway_enter_${id}`)
        .setLabel('Enter Giveaway 🎉')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`giveaway_leave_${id}`)
        .setLabel('Leave Giveaway ❌')
        .setStyle(ButtonStyle.Danger),
    );

    const gwMsg = await message.channel.send({ embeds: [embed], components: [row] });

    giveawayInfo[id] = {
      name,
      prize,
      messageId: gwMsg.id,
      channelId: message.channel.id,
      endsAt: endsAt.toMillis(),
      hostId: message.author.id,
      participants: [],
    };

    saveGiveaways();
  }
};
