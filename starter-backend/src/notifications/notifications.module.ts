import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
     imports: [PrismaModule, AuditLogModule],
     controllers: [NotificationsController],
     providers: [NotificationsService],
     exports: [NotificationsService],
})
export class NotificationsModule { }
