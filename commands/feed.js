const { readUsers, saveUsers } = require("../utils");

module.exports = {
  name: "feed",
  description: "Feed your pet...",
  async execute(message, args) {
    const usersData = readUsers();

    const userId = message.author.id;
    const user = usersData[userId];

    if (!user) {
      return message.reply("❌ You don't have a profile yet! Use `!start` to create one.");
    }

    if (!user.pet) {
      return message.reply("❌ You don't have a pet to feed!");
    }

    if (user.inventory.food <= 0) {
      return message.reply("❌ You don't have any food! Get some first.");
    }

    if (user.pet.hunger === 0) {
      return message.reply("✅ Your pet is not hungry!");
    }

    user.pet.hunger = Math.max(0, user.pet.hunger - 20);
    user.pet.happiness = Math.min(100, user.pet.happiness + 10);
    user.inventory.food -= 1;

    saveUsers(usersData);

    return message.reply(
      `🍗 You fed **${user.pet.name}**! Hunger: ${user.pet.hunger}%, Happiness: ${user.pet.happiness}%`
    );
  },
};
