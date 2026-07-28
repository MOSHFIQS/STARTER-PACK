import { Injectable, Logger } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';

export interface RequestMeta {
     ipAddress?: string;
     device?: string;
     userAgent?: string;
}

@Injectable()
export class SettingsService {
     private readonly logger = new Logger(SettingsService.name);

     constructor(
          private readonly prisma: PrismaService,
          private readonly auditLog: AuditLogService,
     ) { }

     // ==================== SITE SETTINGS (SINGLETON) ====================

     /**
      * Get the singleton site settings row. Creates a default row if none exists.
      */
     async getSiteSettings() {
          let settings = await this.prisma.siteSetting.findFirst();
          if (!settings) {
               settings = await this.prisma.siteSetting.create({
                    data: { siteName: 'StarterApp' },
               });
          }
          return settings;
     }

     /**
      * Update the singleton site settings row.
      */
     async updateSiteSettings(dto: UpdateSiteSettingDto, actor: { id: string; role: string }, meta: RequestMeta) {
          const existing = await this.getSiteSettings();

          const updated = await this.prisma.siteSetting.update({
               where: { id: existing.id },
               data: dto,
          });

          await this.auditLog.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.UPDATE,
               entity: 'SiteSetting',
               entityId: updated.id,
               ipAddress: meta.ipAddress,
               device: meta.device,
               userAgent: meta.userAgent,
               beforeValue: existing,
               afterValue: updated,
               description: 'Updated site settings',
          });

          return updated;
     }
}
