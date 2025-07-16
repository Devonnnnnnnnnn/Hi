module.exports = {
  name: "ping",
  description: "Check latency.",
  async execute(message) {
    const sentMsg = await message.channel.send("🏓 Pinging...");
    const latency = sentMsg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);
    await sentMsg.edit(
      `🏓 **Pong!**\n` +
      `🕑 Latency: **${latency}ms**\n` +
      `🌐 API: **${apiLatency}ms**`
    );
  },
};
