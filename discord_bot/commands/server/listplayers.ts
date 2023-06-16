import { SlashCommandBuilder, EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction, ActionRowBuilder } from 'discord.js';
import Game from '../../../src/Game';
import Player from '../../../src/Player';
import UserPermissions from '../../UserPermissions';


function showPlayer(game: Game,players: Player[],playernum: number, interaction: any){
	if(players.length == 0){
		return new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`Players`)
		.setTimestamp()
		.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
		.setDescription(`No players currently in game \n [Click to join the game!](http://${process.env.GAME_IP})`);
	}else{
	const playersEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`Players: Player ${playernum + 1} of ${players.length}: ${players[playernum].name}`)
		.setTimestamp()
		.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()});

	
		
	playersEmbed.setDescription(`[Click to join the game!](http://${process.env.GAME_IP})`)
	
	let player = players[playernum];
	playersEmbed.addFields({
		name: "Submitted prompt:",
		value: player.origPrompt ? inlineCode(player.origPrompt) : "N/A" 
	},{
		name: "GPT's Response:",
		value: player.origResponse ? inlineCode(player.origResponse) : "N/A"

	},{
		name: "Received prompt:",
		value: player.newPrompt ? inlineCode(player.newPrompt) : "N/A"

	},{
		name: "Response to Rearrange:",
		value: player.newResponse ? inlineCode(player.newResponse) : "N/A"

	},{
		name: "Submitted Response:",
		value: player.rearrangedResponse ? inlineCode(player.rearrangedResponse) : "N/A"

	})
	return playersEmbed;

	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listplayers')
		.setDescription('Lists all players in the game'),
	async execute(interaction: any) {
		
		let response = await interaction.reply({ content: 'Fetching...', fetchReply: true });
		if(UserPermissions.isDev(interaction.member)){
			let playernum = 0;
			let game: Game = interaction.client.game;
			let players: Player[] = game.players;
			
			const prevbutton = new ButtonBuilder()
			.setCustomId('prevbutton')
			.setLabel("◀️")
			.setStyle(ButtonStyle.Secondary);
			const nextbutton = new ButtonBuilder()
			.setCustomId('nextbutton')
			.setLabel("▶️")
			.setStyle(ButtonStyle.Secondary);
			const row = new ActionRowBuilder()
			.addComponents(prevbutton, nextbutton);
			const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

			collector.on('collect', async (i:ButtonInteraction) => {
				if(i.member != interaction.member){
					await i.reply({ content: 'This is not your interaction!', ephemeral: true })
					return;
				}
				if(i.customId == "prevbutton"){
					playernum --;
					if(playernum == -1){
						playernum += players.length;
					}
					await i.update({ embeds: [showPlayer(game,players,playernum,interaction)]});
					
		
				}
				if(i.customId == "nextbutton"){
					playernum ++;
					if(playernum == players.length){
						playernum -= players.length;
					}
					await i.update({ embeds: [showPlayer(game,players,playernum,interaction)]});
		
				}
				
			});

			await interaction.editReply({ embeds: [showPlayer(game,players,playernum,interaction)], components:[row] });
			await interaction.editReply("");
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
	},
};