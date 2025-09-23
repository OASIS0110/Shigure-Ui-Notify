-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "notification_user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" varchar(18) NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"members_only_video" boolean DEFAULT true,
	"collaboration" boolean DEFAULT true,
	"disable" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "stream_schedule" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"video_id" varchar(100) NOT NULL,
	"stream_title" varchar(255) NOT NULL,
	"stream_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

*/