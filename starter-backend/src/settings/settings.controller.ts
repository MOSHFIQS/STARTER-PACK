import {
     Body,
     Controller,
     Get,
     Patch,
     Req,
     UseGuards,
} from '@nestjs/common';
import {
     ApiBearerAuth,
     ApiBody,
     ApiOperation,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { AuthUser, CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
     constructor(private readonly settingsService: SettingsService) { }

     // ==================== PUBLIC ENDPOINTS ====================

     @Get('site')
     @Public()
     @ApiOperation({ summary: 'Get public site settings' })
     @ApiResponse({ status: 200, description: 'Site settings retrieved successfully' })
     getSiteSettings() {
          return this.settingsService.getSiteSettings();
     }

     // ==================== ADMIN ENDPOINTS ====================

     @Patch('site')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiBearerAuth('JWT-auth')
     @ApiOperation({ summary: 'Update site settings (Admin only)' })
     @ApiBody({ type: UpdateSiteSettingDto })
     @ApiResponse({ status: 200, description: 'Site settings updated successfully' })
     updateSiteSettings(
          @Body() dto: UpdateSiteSettingDto,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
      ) {
          return this.settingsService.updateSiteSettings(dto, user, this.extractMeta(req));
     }

     private extractMeta(req: Request) {
          return {
               ipAddress: req.ip || req.socket?.remoteAddress,
               device: req.get('user-agent'),
               userAgent: req.get('user-agent'),
          };
     }
}
