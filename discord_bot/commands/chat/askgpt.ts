import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('askgpt')
		.setDescription('Asks gpt4free something')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt to ask')
                .setRequired(true)
        ),
	async execute(interaction: any) {
        const reason = interaction.options.getString('prompt') ?? 'No prompt provided';
		const sent = await interaction.reply({ content: 'Asking...', fetchReply: true });
        let response = await interaction.client.game.gpt.getResponse(interaction.options.getString('prompt'));
		await interaction.editReply(response);
		
		
	},
};