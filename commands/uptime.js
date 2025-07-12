module.exports = {
  name: "uptime",
  description: "Show bot uptime.",
  async execute(message) {
    const totalSeconds = process.uptime();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return message.channel.send(
      `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s`
    );
  },
};
