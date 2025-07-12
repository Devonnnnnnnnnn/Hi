module.exports = {
  name: "ping",
  description: "Check latency.",
  async execute(message) {
    const msg = await message.channel.send("🏓 Pinging...");
    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);
    await msg.edit(
      `🏓 Pong!\n🕑 Latency: **${latency}ms**\n🌐 API: **${apiLatency}ms**`
    );
  },
};
