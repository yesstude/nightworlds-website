-- AlterTable
ALTER TABLE `Character` ADD COLUMN `serverName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Server` (
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_serverName_fkey` FOREIGN KEY (`serverName`) REFERENCES `Server`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
