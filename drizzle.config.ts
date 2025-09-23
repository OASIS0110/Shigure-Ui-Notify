import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/",
  out: "./src/db",
	dbCredentials: {
		host: process.env.POSTGRES_HOST || 'localhost',
		port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
		user: process.env.POSTGRES_USER || '',
		password: process.env.POSTGRES_PASSWORD || '',
		database: process.env.POSTGRES_DB || '',
		ssl: false,
	}
});