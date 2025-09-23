import { ChatInput } from '@akki256/discord-interaction';
import { notificationServers, notificationUsers } from '@db/schema';
import { ApplicationCommandOptionType } from 'discord.js';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
	user: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || '',
	database: process.env.POSTGRES_DB || 'postgres',
	ssl: false,
});
const db = drizzle({ client: pool });

const subscribe = new ChatInput(
	{
		name: 'subscribe',
		description: '通知を登録します。',
		options: [
			{
				name: 'members_only',
				description: 'メンバー限定配信を通知するか(デフォルト：有効)',
				required: false,
				type: ApplicationCommandOptionType.Boolean,
			},
			{
				name: 'presume',
				description:
					'他チャンネルに出演する可能性がある場合に通知するか(デフォルト：有効)',
				required: false,
				type: ApplicationCommandOptionType.Boolean,
			},
		],
	},
	async (interaction) => {
		const membersOnly = interaction.options.getBoolean('members_only') ?? true;
		const collaboration = interaction.options.getBoolean('presume') ?? true;
		const replyContent = [];
		if (interaction.guild) {
			const guildId = interaction.guild.id;
			const channelId = interaction.channelId;
			await db
				.select()
				.from(notificationServers)
				.where(eq(notificationServers.guildId, guildId))
				.then(async (rows) => {
					if (rows.length > 0) {
						await db
							.update(notificationServers)
							.set({
								channelId: interaction.channelId,
								membersOnlyVideo: membersOnly,
								collaboration: collaboration,
							})
							.where(eq(notificationServers.guildId, guildId));
						replyContent.push('通知設定を更新しました！');
					} else {
						await db.insert(notificationServers).values({
							guildId: guildId,
							channelId: channelId,
							membersOnlyVideo: membersOnly,
							collaboration: collaboration,
						});
						replyContent.push('通知を登録しました！');
					}
					replyContent.push(`送信チャンネル: <#${channelId}>`);
				});
		} else {
			const userId = interaction.user.id;
			const userName = interaction.user.username;
			await db
				.select()
				.from(notificationUsers)
				.where(eq(notificationUsers.userId, userId))
				.then(async (rows) => {
					if (rows.length > 0) {
						await db
							.update(notificationUsers)
							.set({
								userName: userName,
								membersOnlyVideo: membersOnly,
								collaboration: collaboration,
							})
							.where(eq(notificationUsers.userId, userId));
						replyContent.push('通知設定を更新しました！');
					} else {
						await db.insert(notificationUsers).values({
							userId: userId,
							userName: userName,
							membersOnlyVideo: membersOnly,
							collaboration: collaboration,
						});
						replyContent.push('通知を登録しました！');
					}
				});
		}
		replyContent.push(
			`メンバー限定動画: ${membersOnly ? ':green_circle:有効' : ':red_circle:無効'}`,
		);
		replyContent.push(
			`コラボ通知: ${collaboration ? ':green_circle:有効' : ':red_circle:無効'}`,
		);

		await interaction.reply({ content: replyContent.join('\n') });
	},
);

export default [subscribe];