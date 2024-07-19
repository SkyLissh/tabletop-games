CREATE TABLE `roulette_options` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) DEFAULT 'Option' NOT NULL,
	`text_color` text(7),
	`background_color` text(7),
	`roulette_id` text
);
--> statement-breakpoint
CREATE TABLE `roulettes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) DEFAULT 'My Roulette' NOT NULL,
	`user_id` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL
);
