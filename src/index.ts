import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import { getConfig } from "./config/configuration";

const config = getConfig("development");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    ,
  ],

  partials: [
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});

// assign client.commands to a new Collection
client.commands = new Collection();

const rest = new REST({ version: "10" }).setToken(config.token);

const commandsDir = join(__dirname, "commands");
const commands = [];
const commandsModules = readdirSync(commandsDir).filter((file) =>
  new RegExp("(.*?).command.(js|ts)$").test(file)
);

for (const file of commandsModules) {
  const command = require(join(commandsDir, file));
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      await command.execute(interaction);
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

async function bootstrap() {
  try {
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });
  } catch (error) {
    console.error(error);
  }

  await client.login(config.token);
}

bootstrap();
