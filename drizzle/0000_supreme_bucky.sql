CREATE TABLE `nw_session` (
	`id` varchar(255) NOT NULL,
	`user` varchar(25),
	`type` varchar(16) NOT NULL,
	`ip_address` varchar(16),
	`ip_data` json,
	`region-name` varchar(128),
	`useragent` varchar(128),
	`platform` varchar(32),
	`browser` varchar(64),
	`logged_at` datetime,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `nw_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_user` (
	`id` varchar(25) NOT NULL,
	`nickname` varchar(32),
	`password_hash` varchar(64),
	CONSTRAINT `nw_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `nw_user_nickname_unique` UNIQUE(`nickname`)
);
--> statement-breakpoint
ALTER TABLE `nw_session` ADD CONSTRAINT `nw_session_user_nw_user_id_fk` FOREIGN KEY (`user`) REFERENCES `nw_user`(`id`) ON DELETE no action ON UPDATE no action;