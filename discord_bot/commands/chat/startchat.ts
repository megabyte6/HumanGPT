import { BaseInteraction, CommandInteraction, Message, MessageCollector, SlashCommandBuilder } from 'discord.js';
import { Chat } from '../../../src/GPT4FreeRequester';
import UserPermissions from '../../UserPermissions';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startchat')
		.setDescription('Asks gpt4free something')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt to start with')
                .setRequired(true)
        ),
	async execute(interaction: any) {
        const reason = interaction.options.getString('prompt') ?? 'No prompt provided';
        const sent = await interaction.reply({ content: 'Starting...', fetchReply: true });
        if(UserPermissions.isDev(interaction.member)){
            let prompt = interaction.options.getString('prompt');
            let response = await interaction.client.game.gpt.getResponse(prompt);
		    await interaction.editReply(response);
            let chat: Chat[] = [];
            chat.push({question: prompt, answer: response});
            let collector: MessageCollector = interaction.channel.createMessageCollector({ time: 10 * 60 * 1000 });
            
            collector.on('collect', async (message: Message)=>{
                if(message.author.bot) return;
                
                if(message.content == "!stop" && UserPermissions.isDev(message.member)){
                    collector.stop("dev stopped")
                    await message.reply("Chat stopped.");
                    return;
                }
                let response = await interaction.client.game.gpt.getResponse(message.content,chat);
                chat.push({question: message.content, answer: response});
                await message.reply(response);

            })

            collector.on("end", ()=>{
                
            })
			
		}
		else{
			await interaction.editReply(`Only devs may use this command!`);
		}
		
		
		
	},
};