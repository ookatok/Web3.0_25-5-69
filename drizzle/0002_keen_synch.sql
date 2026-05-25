CREATE TABLE `projects` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`client` varchar(255),
	`category` varchar(100),
	`images` json DEFAULT ('[]'),
	`cover_image` varchar(500),
	`date` timestamp,
	`status` enum('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);