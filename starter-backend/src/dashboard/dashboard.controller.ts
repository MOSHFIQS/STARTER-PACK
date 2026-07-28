import {
     Controller,
     Get,
     Query,
     UseGuards,
} from '@nestjs/common';
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
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
     constructor(private readonly dashboardService: DashboardService) { }

     @Get('admin/overview')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Admin dashboard overview (Admin only)',
          description: 'High-level counts and pending items across the platform.',
     })
     @ApiResponse({ status: 200, description: 'Overview retrieved successfully' })
     getAdminOverview() {
          return this.dashboardService.getAdminOverview();
     }

     @Get('admin/users')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({ summary: 'User statistics (Admin only)' })
     @ApiResponse({ status: 200, description: 'User stats retrieved successfully' })
     getUserStats() {
          return this.dashboardService.getUserStats();
     }

     @Get('admin/recent/users')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({ summary: 'Recent registrations (Admin only)' })
     @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records (default 10)' })
     @ApiResponse({ status: 200, description: 'Recent users retrieved successfully' })
     getRecentUsers(@Query('limit') limit?: number) {
          return this.dashboardService.getRecentUsers(limit ? Number(limit) : 10);
     }
}
