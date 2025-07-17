module.exports = {
  name: "ping",
  description: "Check latency.",
  async execute(message) {
    try {
      const sentMsg = await message.channel.send("🏓 Pinging...");
      const latency = sentMsg.createdTimestamp - message.createdTimestamp;
      const apiLatency = Math.round(message.client.ws.ping);
      await sentMsg.edit(
        `🏓 **Pong!**\n` +
        `🕑 Latency: **${latency}ms**\n` +
        `🌐 API: **${apiLatency}ms**`
      );
    } catch (error) {
      console.error("Ping command error:", error);
      message.channel.send("❌ Something went wrong while checking ping.");
    }
  },
};
