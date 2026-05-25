CREATE TABLE `contacts` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50),
	`email` varchar(255),
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
