import {
     BadRequestException,
     Controller,
     Delete,
     Post,
     Query,
     UploadedFile,
     UploadedFiles,
     UseGuards,
     UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
     ApiBearerAuth,
     ApiBody,
     ApiConsumes,
     ApiOperation,
     ApiQuery,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CLOUDINARY_FOLDERS, CloudinaryFolder } from '../common/constants';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CloudinaryController {
     constructor(private readonly cloudinaryService: CloudinaryService) { }

     @Post('image')
     @ApiOperation({
          summary: 'Upload a single image',
          description:
               'Upload a single image file (jpeg, jpg, png, gif, webp) to Cloudinary. Max size 10MB. Returns a secure Cloudinary URL.',
     })
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    file: {
                         type: 'string',
                         format: 'binary',
                         description: 'Image file (jpeg, jpg, png, gif, webp) - max 10MB',
                    },
               },
               required: ['file'],
          },
     })
     @ApiQuery({
          name: 'folder',
          description: 'Target Cloudinary folder',
          enum: CLOUDINARY_FOLDERS,
          required: false,
     })
     @ApiResponse({
          status: 201,
          description: 'Image uploaded successfully',
          schema: {
               example: {
                    success: true,
                    message: 'Image uploaded successfully',
                    data: {
                         url: 'https://res.cloudinary.com/demo/image/upload/v123/property-chai/properties/abc.jpg',
                         secureUrl: 'https://res.cloudinary.com/demo/image/upload/v123/property-chai/properties/abc.jpg',
                         publicId: 'property-chai/properties/abc',
                         format: 'jpg',
                         bytes: 245678,
                         width: 1920,
                         height: 1080,
                    },
               },
          },
     })
     @ApiResponse({ status: 400, description: 'Invalid file type or size' })
     @UseInterceptors(FileInterceptor('file'))
     uploadImage(
          @UploadedFile() file: Express.Multer.File,
          @Query('folder') folder?: CloudinaryFolder,
     ) {
          if (!file) throw new BadRequestException('No file provided');
          return this.cloudinaryService.uploadImage(file, folder || CLOUDINARY_FOLDERS.PROPERTIES);
     }

     @Post('images')
     @ApiOperation({
          summary: 'Upload multiple images',
          description: 'Upload multiple image files at once. Max 10 images, each up to 10MB.',
     })
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    files: {
                         type: 'array',
                         items: { type: 'string', format: 'binary' },
                         description: 'Image files (max 10)',
                    },
               },
               required: ['files'],
          },
     })
     @ApiQuery({ name: 'folder', enum: CLOUDINARY_FOLDERS, required: false })
     @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
     @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
     uploadImages(
          @UploadedFiles() files: { files?: Express.Multer.File[] },
          @Query('folder') folder?: CloudinaryFolder,
     ) {
          if (!files?.files?.length) throw new BadRequestException('No files provided');
          return this.cloudinaryService.uploadMultipleImages(
               files.files,
               folder || CLOUDINARY_FOLDERS.PROPERTIES,
          );
     }

     @Post('video')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Upload a single video (Admin only)',
          description: 'Upload a single video file (mp4, mov, avi, webm) to Cloudinary. Max size 100MB.',
     })
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    file: {
                         type: 'string',
                         format: 'binary',
                         description: 'Video file (mp4, mov, avi, webm) - max 100MB',
                    },
               },
               required: ['file'],
          },
     })
     @ApiQuery({ name: 'folder', enum: CLOUDINARY_FOLDERS, required: false })
     @ApiResponse({ status: 201, description: 'Video uploaded successfully' })
     @UseInterceptors(FileInterceptor('file'))
     uploadVideo(
          @UploadedFile() file: Express.Multer.File,
          @Query('folder') folder?: CloudinaryFolder,
     ) {
          if (!file) throw new BadRequestException('No file provided');
          return this.cloudinaryService.uploadVideo(file, folder || CLOUDINARY_FOLDERS.VIDEOS);
     }

     @Post('document')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Upload a document (Admin only)',
          description: 'Upload a document (pdf, doc, docx, xls, xlsx, txt) to Cloudinary. Max size 20MB.',
     })
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    file: {
                         type: 'string',
                         format: 'binary',
                         description: 'Document file (pdf, doc, docx, xls, xlsx, txt) - max 20MB',
                    },
               },
               required: ['file'],
          },
     })
     @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
     @UseInterceptors(FileInterceptor('file'))
     uploadDocument(@UploadedFile() file: Express.Multer.File) {
          if (!file) throw new BadRequestException('No file provided');
          return this.cloudinaryService.uploadDocument(file);
     }

     @Delete()
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Delete a file from Cloudinary (Admin only)',
          description: 'Delete a file from Cloudinary using its public ID.',
     })
     @ApiQuery({ name: 'publicId', description: 'Cloudinary public ID of the file' })
     @ApiQuery({
          name: 'resourceType',
          description: 'Resource type',
          enum: ['image', 'video', 'raw'],
          required: false,
     })
     @ApiResponse({ status: 200, description: 'File deleted successfully' })
     deleteFile(
          @Query('publicId') publicId: string,
          @Query('resourceType') resourceType?: 'image' | 'video' | 'raw',
     ) {
          if (!publicId) throw new BadRequestException('publicId is required');
          return this.cloudinaryService.deleteFile(publicId, resourceType || 'image');
     }
}
