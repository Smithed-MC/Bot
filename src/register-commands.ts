const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config');

const register = () => {
	const commands = [];
	const commandFiles = fs.readdirSync('out/commands').filter((file: string) => file.endsWith('.js'));

	console.log('Registering commands')
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`).default;
		if(command.data == null) { console.log(`{file} has no valid data`); continue; }
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(token);

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}

export default register