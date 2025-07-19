require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const prefix = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Initialize commands map BEFORE loading commands
client.commands = new Map();

// Admin IDs
const adminIDs = [
  "826494218355605534",
  "1385377368108961884",
  "1231292898469740655",
];

// Blacklist for Bitcoin blessings
const excludedUserIds = new Set([
  "826494218355605534",
  "1231292898469740655",
]);

// Load commands recursively from a directory
function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommands(fullPath);
    } else if (entry.name.endsWith(".js")) {
      const command = require(fullPath);
      if (command.name && typeof command.execute === "function") {
        client.commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
      } else {
        console.warn(`Skipping invalid command file: ${fullPath}`);
      }
    }
  }
}

// Load events recursively from a directory
function loadEvents(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadEvents(fullPath);
    } else if (entry.name.endsWith(".js")) {
      const event = require(fullPath);
      if (event.name && typeof event.execute === "function") {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`Loaded event: ${event.name}`);
      } else {
        console.warn(`Skipping invalid event file: ${fullPath}`);
      }
    }
  }
}

// Message command handler
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    const argsString = args.join(" ");
    await command.execute(message, argsString, adminIDs);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

async function startBot() {
  try {
    loadCommands(path.join(__dirname, "commands"));
    loadEvents(path.join(__dirname, "events"));
  } catch (err) {
    console.error("Error loading commands or events:", err);
    process.exit(1);
  }

  client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Bitcoin blessing loop — every 6 hours
    const STEAL_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

    setInterval(async () => {
      try {
        const guild = client.guilds.cache.first(); // Use appropriate logic if more guilds
        if (!guild) {
          return console.warn("❌ Bot is not in any guilds.");
        }

        await guild.members.fetch(); // Ensure member cache is full

        const eligibleMembers = guild.members.cache.filter(
          (member) => !member.user.bot && !excludedUserIds.has(member.id)
        );

        if (eligibleMembers.size === 0) {
          return console.warn("⚠️ No eligible members to bless.");
        }

        const target = eligibleMembers.random();

        try {
          await target.send(
            `💻 You've been **blessed**!\n🪙 1 Bitcoin has been given to your account.`
          );
          console.log(`💸 Gave 1 Bitcoin to ${target.user.tag}`);
        } catch (dmErr) {
          console.warn(`⚠️ Couldn't DM ${target.user.tag}: ${dmErr.message}`);
        }
      } catch (err) {
        console.error("❌ Error during Bitcoin giving loop:", err);
      }
    }, STEAL_INTERVAL);
  });

  console.log("Logging in with token (first 10 chars):", process.env.TOKEN?.slice(0, 10));
  await client.login(process.env.TOKEN);

  // Express server to keep bot alive
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get("/", (req, res) => {
    const user = req.query.user || client.user?.username || "Bot";
    res.send(
      `Bot is running and active for user: ${user}.\nStatus: Online.\nChecked at: ${new Date().toISOString()}`
    );
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Express server listening on port ${PORT}`);
  });
}

startBot();
