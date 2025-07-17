module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content;

    try {
      const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(content)}`);
      const containsProfanityText = await response.text();
      const containsProfanity = containsProfanityText === "true";

      if (containsProfanity) {
        try {
          await message.delete();
          console.log(`Deleted message from ${message.author.tag}: "${content}"`);
        } catch (err) {
          console.error("Failed to delete message:", err);
        }

        // Delay DM slightly
        setTimeout(async () => {
          try {
            await message.author.send(
              "⚠️ Your message contained inappropriate language and was deleted. Please watch your language."
            );
          } catch (err) {
            console.error("Failed to send DM to user:", err);
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Error checking profanity:", err);
    }
  },
};
