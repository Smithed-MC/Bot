import fs from 'fs';
import { Client, Collection, CommandInteraction, Intents } from 'discord.js';
import './setup-firebase.js';
import { SlashCommandBuilder } from '../node_modules/@discordjs/builders/dist/index.js';
const { token } = require('./config');


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

interface CommandEntry {
  data: SlashCommandBuilder, 
  execute: (i: CommandInteraction)=>Promise<void>
}

let commands = new Collection<string, CommandEntry>();


const commandFiles = fs.readdirSync('out/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`).default;
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
  console.log(command)
  commands.set(command.data.name, command);
}

console.log(commands)

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });


client.on('messageCreate', (message) => {
  console.log(message)
})
client.login(token)