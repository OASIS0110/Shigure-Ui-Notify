import path from 'node:path';
import {
	DiscordInteractions,
	ErrorCodes,
	InteractionsError,
} from '@akki256/discord-interaction';
import { DiscordEvents } from '@modules/events';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
	],
});

const interactions = new DiscordInteractions(client);
interactions.loadRegistries(path.resolve(__dirname, './commands'));

const events = new DiscordEvents(client);
events.register(path.resolve(__dirname, './events'));

const guildId = process.env.GUILD_ID ?? undefined;

client.once(Events.ClientReady, (): void => {
	console.log('[INFO] BOT ready!');
	interactions.registerCommands({ guildId: guildId });
});

client.on(Events.InteractionCreate, (interaction): void => {
	if (!interaction.isRepliable()) return;

	interactions.run(interaction).catch((err) => {
		if (
			err instanceof InteractionsError &&
			err.code === ErrorCodes.CommandHasCoolTime
		) {
			interaction.reply({
				content: '`⌛` コマンドはクールダウン中です',
				ephemeral: true,
			});
			return;
		}
		console.log(err);
	});
});

client.login();
