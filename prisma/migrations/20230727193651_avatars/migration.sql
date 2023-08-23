-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatarCharacterId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_avatarCharacterId_fkey` FOREIGN KEY (`avatarCharacterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
