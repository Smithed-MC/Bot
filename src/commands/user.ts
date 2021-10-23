import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js/typings/index';
import {database} from '../setup-firebase'

interface User {
	displayName: string,
	role: string,
	packs: any[],
	donation: {[key:string]: string}
}

let users: {[key: string]: User} = {}
database.ref('users/').on('value', (snap) => {
	users = snap.val()
})

export default {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Gets you a user\'s public info')
		.addStringOption(option => option.setName('display-name').setDescription('Smithed Display Name').setRequired(true)),
		
	async execute(interaction: CommandInteraction) {
		const id = interaction.options.getString('display-name')

		for(let u in users) {
			if(users[u].displayName == id) {

				await interaction.reply({embeds: [
					{
						color:'#1B48C4',
						title:`${id}'s Info`,
						fields: [
							{
								name: 'Id',
								value: `\`\`${u}\`\``
							},
							{
								name: '# of Packs',
								value: `\`\`${users[u].packs != null ? users[u].packs.length : '0'}\`\``
							},
							{
								name: 'Role',
								value: `\`\`${users[u].role.charAt(0).toUpperCase() + users[u].role.substring(1)}\`\``
							}
						]
					}
				]});

				return;
			}
		}

		await interaction.reply(`User ${id} not found`)
	},
};