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
		.setName('download')
		.setDescription('Generates a link to download a pack')
		.addStringOption(option => option.setName('pack').setDescription('<owner>:<id>').setRequired(true)),
		
	async execute(interaction: CommandInteraction) {
		const pack = interaction.options.getString('pack')

        if(pack !== null) {
            const parts = pack.split(':')
            await interaction.reply(`<https://smithed.dev/download/${parts[0]}/${parts[1]}>`)
        }
	},
};