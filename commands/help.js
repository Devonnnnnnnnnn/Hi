const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "List commands.",
  async execute(message) {
    const commandCategories = [
      {
        category: "General ⚙️",
        commands: [
          { name: "!ping", desc: "Check the bot's latency." },
          { name: "!help", desc: "Show this help message." },
          { name: "!uptime", desc: "Show how long the bot has been online." },
        ],
      },
      {
        category: "Styles & Gameplay 🎮",
        commands: [
          { name: "!info", desc: "Get info about a style or ability." },
          { name: "!setstyle", desc: "Set your style." }
          { name: "!list", desc: "List all styles." },
        ],
      },
      {
        category: "User & Profile 👤",
        commands: [
          { name: "!profile", desc: "View your or another user's profile." },
          { name: "!verifyroblox", desc: "Verify your Roblox account." },
        ],
      },
      {
        category: "Fun & Games 🎲",
        commands: [
          { name: "!rps", desc: "Play rock-paper-scissors." },
          { name: "!g", desc: "Start a giveaway." },
        ],
      },
    ];

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("📚 Command Help")
      .setDescription("Welcome to the help menu! Use the commands below to interact with me.")
      .setFooter({
        text: `Requested by ${message.author.tag} | Powered by ${message.client.user.username}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    for (const cat of commandCategories) {
      const value = cat.commands
        .map(cmd => `**${cmd.name}**\n_${cmd.desc}_`)
        .join("\n\n");

      embed.addFields({ name: cat.category, value });
    }

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending help message:', error);
      await message.channel.send("❌ Sorry, I couldn't send the help message.");
    }
  },
};
