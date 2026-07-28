import { Global, Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';

@Global()
@Module({
     providers: [AuditLogService],
     controllers: [AuditLogController],
     exports: [AuditLogService],
})
export class AuditLogModule { }
