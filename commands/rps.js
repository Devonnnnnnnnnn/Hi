const choices = ["rock", "paper", "scissors"];

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
    if (userChoice === botChoice) result = "It's a tie!";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    )
      result = "You win!";
    else result = "You lose!";

    return message.channel.send(`You chose **${userChoice}**.\nI chose **${botChoice}**.\n${result}`);
  },
};
