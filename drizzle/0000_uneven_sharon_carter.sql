CREATE TABLE `nw_account` (
	`id` varchar(25) NOT NULL,
	`user` varchar(25),
	`type` varchar(16) NOT NULL,
	`identifier` varchar(128) NOT NULL,
	`secondary` json,
	CONSTRAINT `nw_account_id` PRIMARY KEY(`id`),
	CONSTRAINT `nw_account_identifier_unique` UNIQUE(`identifier`)
);
--> statement-breakpoint
CREATE TABLE `nw_notifications` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`type` varchar(32) NOT NULL,
	`subscription_id` varchar(25),
	`payment_id` varchar(25),
	`sent_date` datetime,
	CONSTRAINT `nw_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_paymethods` (
	`id` varchar(25) NOT NULL,
	`provider_id` varchar(256),
	`user_id` varchar(25) NOT NULL,
	`provider` varchar(16) NOT NULL,
	`card` json,
	`created_at` datetime NOT NULL,
	CONSTRAINT `nw_paymethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_payments` (
	`id` varchar(25) NOT NULL,
	`external_id` varchar(256),
	`user_id` varchar(25) NOT NULL,
	`provider` varchar(16) NOT NULL,
	`amount` double NOT NULL,
	`saved_method_id` varchar(25),
	`type` varchar(16) NOT NULL,
	`subscription_id` varchar(25),
	`description` text,
	`created_at` datetime NOT NULL,
	`closed_at` datetime,
	`result` varchar(16),
	CONSTRAINT `nw_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_players` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`last_nickname` varchar(32),
	`created_at` datetime NOT NULL,
	CONSTRAINT `nw_players_id` PRIMARY KEY(`id`),
	CONSTRAINT `nw_players_last_nickname_unique` UNIQUE(`last_nickname`)
);
--> statement-breakpoint
CREATE TABLE `nw_residents` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`state_id` varchar(25) NOT NULL,
	`started_at` datetime NOT NULL,
	`ended_at` datetime,
	CONSTRAINT `nw_residents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_servers` (
	`id` varchar(25) NOT NULL,
	`world_id` varchar(32) NOT NULL,
	`overwrite_name` varchar(64),
	`may_be_down` boolean NOT NULL DEFAULT false,
	`remote_method` varchar(32),
	`remote_data` json,
	`preorderable` boolean NOT NULL DEFAULT false,
	`api_key_hash` varchar(64),
	`started_at` datetime NOT NULL,
	`closed_at` datetime,
	CONSTRAINT `nw_servers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_session` (
	`id` varchar(255) NOT NULL,
	`user` varchar(25),
	`type` varchar(16) NOT NULL,
	`ip_address` varchar(16),
	`ip_data` json,
	`region-name` varchar(128),
	`useragent` varchar(256),
	`platform` varchar(32),
	`browser` varchar(64),
	`created_at` datetime NOT NULL DEFAULT now(),
	`logged_at` datetime,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `nw_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_settlements` (
	`id` varchar(25) NOT NULL,
	`state_id` varchar(25) NOT NULL,
	`localized_name` json NOT NULL,
	`creator_id` varchar(25) NOT NULL,
	`created_at` datetime NOT NULL,
	`verified_at` datetime,
	CONSTRAINT `nw_settlements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_states` (
	`id` varchar(25) NOT NULL,
	`localized_name` json NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`created_at` datetime NOT NULL,
	`verified_at` datetime,
	CONSTRAINT `nw_states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_subscriptions` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`autoprolong_with` varchar(25),
	`tag` varchar(64) NOT NULL,
	`created_at` datetime NOT NULL,
	`started_at` datetime,
	`should_end_at` datetime,
	`ended_at` datetime,
	`frozen_at` datetime,
	`freeze_reason` varchar(16),
	CONSTRAINT `nw_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nw_user` (
	`id` varchar(25) NOT NULL,
	`is_set_up` boolean NOT NULL DEFAULT false,
	`license_type` varchar(16),
	`nickname` varchar(32),
	`password_hash` varchar(64),
	`is_admin` boolean NOT NULL DEFAULT false,
	`registered_at` datetime NOT NULL,
	CONSTRAINT `nw_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `nw_user_nickname_unique` UNIQUE(`nickname`)
);
--> statement-breakpoint
ALTER TABLE `nw_account` ADD CONSTRAINT `nw_account_user_nw_user_id_fk` FOREIGN KEY (`user`) REFERENCES `nw_user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_notifications` ADD CONSTRAINT `nw_notifications_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_notifications` ADD CONSTRAINT `nw_notifications_subscription_id_nw_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `nw_subscriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_notifications` ADD CONSTRAINT `nw_notifications_payment_id_nw_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `nw_payments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_paymethods` ADD CONSTRAINT `nw_paymethods_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_payments` ADD CONSTRAINT `nw_payments_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_payments` ADD CONSTRAINT `nw_payments_saved_method_id_nw_paymethods_id_fk` FOREIGN KEY (`saved_method_id`) REFERENCES `nw_paymethods`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_payments` ADD CONSTRAINT `nw_payments_subscription_id_nw_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `nw_subscriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_players` ADD CONSTRAINT `nw_players_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_residents` ADD CONSTRAINT `nw_residents_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_residents` ADD CONSTRAINT `nw_residents_state_id_nw_states_id_fk` FOREIGN KEY (`state_id`) REFERENCES `nw_states`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_session` ADD CONSTRAINT `nw_session_user_nw_user_id_fk` FOREIGN KEY (`user`) REFERENCES `nw_user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_settlements` ADD CONSTRAINT `nw_settlements_state_id_nw_states_id_fk` FOREIGN KEY (`state_id`) REFERENCES `nw_states`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_settlements` ADD CONSTRAINT `nw_settlements_creator_id_nw_user_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_states` ADD CONSTRAINT `nw_states_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_subscriptions` ADD CONSTRAINT `nw_subscriptions_user_id_nw_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `nw_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nw_subscriptions` ADD CONSTRAINT `nw_subscriptions_autoprolong_with_nw_paymethods_id_fk` FOREIGN KEY (`autoprolong_with`) REFERENCES `nw_paymethods`(`id`) ON DELETE set null ON UPDATE no action;