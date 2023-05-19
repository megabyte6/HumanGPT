import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Game from '../../../src/Game';
import Player from '../../../src/Player';


module.exports = {
	data: new SlashCommandBuilder()
		.setName('listplayers')
		.setDescription('Lists all players in the game'),
	async execute(interaction: any) {
		const sent = await interaction.reply({ content: 'Fetching...', fetchReply: true });
		if(interaction.member.roles.cache.has('1108605466436710460')){
			const playersEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Players (click to join the game)')
				.setURL(`http://${process.env.GAME_IP}`)
				.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()});

		
			let game: Game = interaction.client.game;
			let players: Player[] = game.players;
			if(players.length == 0){
				playersEmbed.setDescription("No players currently in game")
			}
			players.forEach((player:Player)=>{
				playersEmbed.addFields({
					name: player.name,
					value: ` • Submitted prompt: \`${player.origPrompt}\`\n\n • Response: \`${player.origResponse}\`\n\n • New prompt: \`${player.newPrompt}\`\n\n • Response to rearrange: \`${player.newResponse}\``

				})


			})

			await interaction.editReply({ embeds: [playersEmbed] });
			await interaction.editReply("");
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
	},
};