declare module 'node:process' {
	global {
		namespace NodeJS {
			interface ProcessEnv {
				readonly GUILD_ID: string;
				DISCORD_TOKEN: string;
				POSTGRES_HOST: string;
				POSTGRES_PORT: string;
				POSTGRES_USER: string;
				POSTGRES_PASSWORD: string;
				POSTGRES_DB: string;
			}
		}
	}
}