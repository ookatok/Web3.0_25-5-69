CREATE TABLE `posts` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` varchar(500),
	`content` text NOT NULL,
	`cover_image` varchar(500),
	`category` varchar(100),
	`tags` json DEFAULT ('[]'),
	`status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`views` int NOT NULL DEFAULT 0,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_at_idx` ON `posts` (`published_at`);