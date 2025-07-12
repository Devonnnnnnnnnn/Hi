const styleStats = require("../data/styleStats.js");

module.exports = {
  name: "list",
  description: "List all styles.",
  async execute(message) {
    const styles = Object.keys(styleStats).sort();
    const formatted = styles.join(", ");

    // If too long, paginate or just send summary
    if (formatted.length > 2000) {
      return message.channel.send("Too many styles to list.");
    }

    return message.channel.send(`📋 Styles:\n${formatted}`);
  },
};
