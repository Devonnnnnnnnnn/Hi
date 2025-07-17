const { EmbedBuilder } = require("discord.js");

const choices = ["rock", "paper", "scissors"];
const emojis = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

module.exports = {
  name: "rps",
  description: "Play rock paper scissors.",
async execute(message, args) {
  const argsString = args.join(" ");
  if (!argsString) {
    return message.channel.send("❗ Usage: `!rps <rock|paper|scissors>`");
  }

  const userChoice = argsString.toLowerCase();
  if (!choices.includes(userChoice)) {
    return message.channel.send("❌ Invalid choice. Choose rock, paper, or scissors.");
  }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result;
    if (userChoice === botChoice) {
      result = "It's a tie! 🤝";
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "You win! 🎉";
    } else {
      result = "You lose! 😢";
    }

    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setColor(0x0099ff)
      .addFields(
        { name: "Your Choice", value: `${emojis[userChoice]} ${userChoice}`, inline: true },
        { name: "Bot's Choice", value: `${emojis[botChoice]} ${botChoice}`, inline: true },
        { name: "Result", value: result }
      )
      .setTimestamp();

    const sentMsg = await message.channel.send({ embeds: [embed] });

    // Optional: react with bot's choice emoji
    await sentMsg.react(emojis[botChoice]);

    return null;
  },
};
