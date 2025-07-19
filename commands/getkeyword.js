const { EmbedBuilder } = require("discord.js");

// In-memory store — you need a shared store or a DB to persist across commands,
// or move this to a utility module that both commands import.
const userKeywords = {}; 

function generateKeyword() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomStr = "";
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `veri-${randomStr}`;
}

module.exports = {
  name: "getkeyword",
  description: "Generates a verification keyword for your Roblox About Me.",
  async execute(message) {
    const keyword = generateKeyword();
    userKeywords[message.author.id] = keyword;

    try {
      await message.author.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Verification Keyword")
            .setDescription(
              `🔑 Your verification keyword is:\n\n\`${keyword}\`\n\n` +
              "Please add this keyword to your Roblox About Me before verifying."
            )
            .setTimestamp(),
        ],
      });
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff00)
            .setDescription("✅ I've sent you a DM with your verification keyword!")
            .setTimestamp(),
        ],
      });
    } catch {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription("❌ I couldn't DM you. Please check your privacy settings.")
            .setTimestamp(),
        ],
      });
    }
  },
  userKeywords, // export to share with verifyroblox
};
