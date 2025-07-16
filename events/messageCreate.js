const usersData = require("../json/users.json");
const { saveUsers } = require("../utils");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const user = usersData[userId];
    if (!user) return; // no profile

    user.xp += 5;

    // Level up check
    while (user.xp >= user.xpRequired) {
      user.xp -= user.xpRequired;
      user.level++;
      user.xpRequired = Math.floor(user.xpRequired * 1.15);
      user.coins += 50;
      message.channel.send(`🎉 Congrats ${message.author}, you leveled up to **${user.level}**!`);
    }

    saveUsers(usersData);
  },
};
