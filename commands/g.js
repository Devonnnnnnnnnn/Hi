const fs = require('fs');
const { DateTime } = require('luxon');
const { EmbedBuilder } = require('discord.js');

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

module.exports = {
  name: 'g',
  description: 'Create a giveaway',
  async execute(message, args, adminIDs) {
    if (!adminIDs.includes(message.author.id)) {
      return message.channel.send("❌ You don’t have permission to use this.");
    }

    const argsString = args.join(' ');
    const [name, prize, durationStr] = argsString.split(',').map(s => s.trim());

    if (!name || !prize || !durationStr) {
      return message.channel.send("❗ Usage: `!g <name>, <prize>, <duration>`");
    }

    const duration = parseDuration(durationStr);
    if (!duration) {
      return message.channel.send("❌ Use a valid duration (10m, 2h, 1d).");
    }

    const endsAt = DateTime.now().plus(duration);
    const id = generateId();

    const embed = new EmbedBuilder()
      .setTitle(`🎁 Giveaway: ${name}`)
      .setDescription(
        `🎉 **Prize**: ${prize}\n` +
        `🕒 **Ends At**: <t:${Math.floor(endsAt.toSeconds())}:F>\n` +
        `React with 🎉 to enter!\n` +
        `🔑 **ID**: \`${id}\``
      )
      .setColor(0xffd700)
      .setFooter({ text: `Hosted by ${message.author.username}` })
      .setTimestamp();

    const gwMsg = await message.channel.send({ embeds: [embed] });
    await gwMsg.react("🎉");

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
