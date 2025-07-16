const choices = ["rock", "paper", "scissors"];
const emojis = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

module.exports = {
  name: "rps",
  description: "Play rock paper scissors.",
  async execute(message, argsString) {
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

    const response = 
      `You chose: ${emojis[userChoice]} **${userChoice}**\n` +
      `I chose: ${emojis[botChoice]} **${botChoice}**\n\n` +
      `**${result}**`;

    const sentMsg = await message.channel.send(response);

    // Optional: React with the bot's choice emoji for fun
    await sentMsg.react(emojis[botChoice]);

    return null;
  },
};
