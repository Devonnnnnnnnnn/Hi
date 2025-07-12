module.exports = {
  name: "help",
  description: "List commands.",
  async execute(message) {
    const commands = [
      "`!ping` - Check latency",
      "`!compare <style1>, <style2>` - Compare styles",
      "`!info <style/ability>` - Get info",
      "`!setstyle <style>` - Set your style",
      "`!verifyroblox <username>` - Verify Roblox",
      "`!profile [user]` - View profile",
      "`!start` - Start playing",
      "`!list` - List styles",
      "`!help` - This help message",
      "`!uptime` - Bot uptime",
      "`!g` - Get something",
      "`!rps <choice>` - Play rock-paper-scissors",
    ];

    return message.channel.send(commands.join("\n"));
  },
};
