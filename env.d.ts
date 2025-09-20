declare module 'node:process' {
	global {
		namespace NodeJS {
			interface ProcessEnv {
				readonly GUILD_ID: string;
			}
		}
	}
}