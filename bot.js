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

// Load commands
client.commands = new Map();
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

// Load events
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
    await command.execute(message, args.join(" "));
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

async function startBot() {
  loadCommands(path.join(__dirname, "commands"));
  loadEvents(path.join(__dirname, "events"));

  client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
  });

  console.log("Logging in with token (first 10 chars):", process.env.TOKEN?.slice(0, 10));
  await client.login(process.env.TOKEN);

  // Express server to keep bot alive
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get("/", (req, res) => {
    const user = req.query.user || client.user?.username || "Bot";
    res.send(`Bot is running and active for user: ${user}.\nStatus: Online.\nChecked at: ${new Date().toISOString()}`);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}

startBot();
