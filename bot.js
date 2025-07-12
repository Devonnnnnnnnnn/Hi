require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");
const express = require("express");
const {
  Client,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const TARGET_CHANNEL_ID = "1391145791623663718";
const TARGET_ROLE_ID = "1388462648739500134";

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

const prefix = "!";

const commands = new Map();
function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadCommands(fullPath);
    } else if (entry.name.endsWith(".js")) {
      const command = require(fullPath);

      if (command.name && typeof command.execute === "function") {
        commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
      } else {
        console.warn(`Skipping invalid command file: ${fullPath}`);
      }
    }
  }
}
let lastNotifiedDate = null;

function startUpdateNotifier() {
  setInterval(async () => {
    const now = DateTime.now().setZone("Europe/Prague");

    if (
      now.weekday === 6 &&
      now.hour === 16 &&
      now.minute === 0 &&
      (!lastNotifiedDate || lastNotifiedDate !== now.toISODate())
    ) {
      lastNotifiedDate = now.toISODate();

      const channel = client.channels.cache.get(TARGET_CHANNEL_ID);
      if (!channel) {
        console.error("Target channel not found.");
        return;
      }

      try {
        await channel.send(`<@&${TARGET_ROLE_ID}> The update has released! Go check it out. 🌻`);
        console.log("Update notification sent.");
      } catch (err) {
        console.error("Failed to send update notification:", err);
      }
    }
  }, 60 * 1000);
}

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

function startBot() {
  loadCommands(path.join(__dirname, "commands"));
  client.commands = commands;

  client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    startUpdateNotifier();
  });

  client.login(process.env.TOKEN);

  // Set up express server for bot "ping" endpoint on a different port or path?
  // Since you want to combine, let's *not* start express here.
}

module.exports = { startBot };
