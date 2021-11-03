import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js/typings/index.js';
import register from '../register-commands';

export default {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads the commands'),

	execute:async (interaction: CommandInteraction) => {
		register()
		await interaction.reply({content:'Reloaded commands',ephemeral:true});
	},
};