const fs = require('fs');
const giveawayPath = './giveaways.json';

let giveawayInfo = {};
if (fs.existsSync(giveawayPath)) {
  giveawayInfo = JSON.parse(fs.readFileSync(giveawayPath, 'utf-8'));
}

function saveGiveaways() {
  fs.writeFileSync(giveawayPath, JSON.stringify(giveawayInfo, null, 2));
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;

    if (!customId.startsWith('giveaway_')) return;

    const [_, action, giveawayId] = customId.split('_');

    const giveaway = giveawayInfo[giveawayId];
    if (!giveaway) {
      return interaction.reply({ content: '❌ Giveaway not found or expired.', ephemeral: true });
    }

    if (action === 'enter') {
      if (giveaway.participants.includes(interaction.user.id)) {
        return interaction.reply({ content: '⚠️ You have already entered this giveaway.', ephemeral: true });
      }

      giveaway.participants.push(interaction.user.id);
      saveGiveaways();

      return interaction.reply({ content: `🎉 You have entered the giveaway: **${giveaway.name}**! Good luck!`, ephemeral: true });
    }

    if (action === 'leave') {
      if (!giveaway.participants.includes(interaction.user.id)) {
        return interaction.reply({ content: '⚠️ You are not currently entered in this giveaway.', ephemeral: true });
      }

      giveaway.participants = giveaway.participants.filter(id => id !== interaction.user.id);
      saveGiveaways();

      return interaction.reply({ content: `❌ You have left the giveaway: **${giveaway.name}**.`, ephemeral: true });
    }
  },
};
