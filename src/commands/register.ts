import { ChatInput } from "@akki256/discord-interaction";

const subscribe = new ChatInput({ name: 'subscribe', description: 'Subscribe to notifications' }, async (interaction) => {
	await interaction.reply('Registering commands...');
	await interaction.client.application?.commands.set(interaction.client.interactions.commands.map(cmd => cmd.data));
	await interaction.editReply('Commands registered!');
});

export default [subscribe];