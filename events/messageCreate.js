module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return; // Ignore bots

    const content = message.content;

    try {
      const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(content)}`);
      const containsProfanityText = await response.text();
      const containsProfanity = containsProfanityText === "true";

      if (containsProfanity) {
        // Try to delete the message
        try {
          await message.delete();
        } catch (err) {
          console.error("Failed to delete message:", err);
        }

        // DM the user a warning
        try {
          await message.author.send(
            "⚠️ Your message contained inappropriate language and was deleted. Please watch your language."
          );
        } catch (err) {
          console.error("Failed to send DM to user:", err);
        }
      }
    } catch (err) {
      console.error("Error checking profanity:", err);
    }
  },
};
