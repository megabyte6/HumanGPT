import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startgame')
		.setDescription('Starts the current game'),
	async execute(interaction: any) {
		const sent = await interaction.reply({ content: 'Starting...', fetchReply: true });
		if(interaction.member.roles.cache.has('1108605466436710460')){
			interaction.client.game.start();
			await interaction.editReply(`Game has started!`);
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
	},
};