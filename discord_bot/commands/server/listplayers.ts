import { SlashCommandBuilder } from 'discord.js';
import Game from '../../../src/Game';
import Player from '../../../src/Player';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listplayers')
		.setDescription('Lists all players in the game'),
	async execute(interaction: any) {
		const sent = await interaction.reply({ content: 'Fetching...', fetchReply: true });
		if(interaction.member.roles.cache.has('1108605466436710460')){
			let game: Game = interaction.client.game;
			let players: Player[] = game.players;
			let reply = `**PLAYERS** \n`;
			players.forEach((player) => {
				reply += `${player.name}: \n   submitted prompt: \`${player.origPrompt}\` \n   response: \`${player.origResponse}\` \n`

			})

			await interaction.editReply(reply);
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
	},
};