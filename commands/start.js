const { saveUsers } = require("../utils");
const usersData = require("../json/users.json");

function getRandomPet() {
  const speciesList = ["Kitten", "Puppy", "Bunny", "Hamster"];
  const names = ["Alex", "Charlie", "Max", "Bella", "Luna", "Simba"];
  const species = speciesList[Math.floor(Math.random() * speciesList.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return { name, species };
}

module.exports = {
  name: "start",
  description: "Start your pet simulator journey.",
  execute(message, args) {
    const userId = message.author.id;
    if (usersData[userId]) {
      return message.reply("✅ You already have a profile! Use `!profile` to view it.");
    }

    const pet = getRandomPet();

    usersData[userId] = {
      username: message.author.username,
      level: 1,
      xp: 0,
      xpRequired: 100,
      coins: 100,
      pet: {
        name: pet.name,
        species: pet.species,
        level: 1,
        xp: { current: 0, required: 150 },
        happiness: 100,
        hunger: 0,
      },
      battles: { wins: 0, losses: 0 },
      inventory: { food: 3, toy: 1 },
      lastXP: Date.now(),
    };

    saveUsers(usersData);

    return message.reply(`🎉 Your pet journey has begun with **${pet.name}** the **${pet.species}**! Use \`!profile\` to view your profile.`);
  },
};
