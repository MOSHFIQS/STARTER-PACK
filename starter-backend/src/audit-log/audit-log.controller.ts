import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
     ApiBearerAuth,
     ApiOperation,
     ApiQuery,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuditLogService } from './audit-log.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@ApiTags('Audit Logs')
@ApiBearerAuth('JWT-auth')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
export class AuditLogController {
     constructor(private readonly auditLogService: AuditLogService) { }

     @Get()
     @ApiOperation({
          summary: 'List audit logs (Admin only)',
          description:
               'Retrieve paginated audit logs with filtering by action, user, entity. Admin access required.',
     })
     @ApiQuery({ name: 'page', required: false, type: Number })
     @ApiQuery({ name: 'limit', required: false, type: Number })
     @ApiQuery({ name: 'search', required: false, type: String })
     @ApiQuery({ name: 'action', required: false, type: String })
     @ApiQuery({ name: 'userId', required: false, type: String })
     @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
     @ApiResponse({ status: 403, description: 'Admin access required' })
     findAll(@Query() dto: FilterAuditLogDto) {
          return this.auditLogService.findAll(dto);
     }

     @Get(':id')
     @ApiOperation({ summary: 'Get audit log by ID (Admin only)' })
     @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
     @ApiResponse({ status: 404, description: 'Audit log not found' })
     findOne(@Param('id') id: string) {
          return this.auditLogService.findOne(id);
     }
}
