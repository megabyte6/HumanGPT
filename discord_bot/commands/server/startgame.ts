import { SlashCommandBuilder } from 'discord.js';
import UserPermissions from '../../UserPermissions';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startgame')
		.setDescription('Starts the current game'),
	async execute(interaction: any) {
		const sent = await interaction.reply({ content: 'Starting...', fetchReply: true });
		if(UserPermissions.isDev(interaction.member)){
			interaction.client.game.start();
			await interaction.editReply(`Game has started!`);
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
	},
};