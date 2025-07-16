module.exports = {
  name: "info",
  aliases: ["information"],
  description: "Get style or ability key name only.",
  async execute(message, argsString) {
    if (!argsString) return message.channel.send("❗ Usage: `!info <style/ability>`");

    const q = argsString.toLowerCase();

    // Find style key (just exact or substring match)
    const sk = Object.keys(require("../data/styleInfo.js")).find(
      (key) => key.toLowerCase() === q || key.toLowerCase().includes(q)
    );

    // Find ability key
    const ak = Object.keys(require("../data/abilityInfo.js")).find(
      (key) => key.toLowerCase() === q || key.toLowerCase().includes(q)
    );

    if (sk) return message.channel.send(`📝 Style: ${sk}`);
    if (ak) return message.channel.send(`📝 Ability: ${ak}`);

    return message.channel.send("❌ No matching style or ability.");
  },
};
