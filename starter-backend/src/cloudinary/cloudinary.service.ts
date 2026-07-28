import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY_FOLDERS, CloudinaryFolder } from '../common/constants';

export interface CloudinaryUploadResult {
     url: string;
     publicId: string;
     secureUrl: string;
     format: string;
     resourceType: string;
     bytes: number;
     width?: number;
     height?: number;
     duration?: number;
}

/**
 * Reusable Cloudinary Service
 * Handles image/video uploads, deletion, replacement, and multiple uploads
 * with automatic folder organization and error handling.
 */
@Injectable()
export class CloudinaryService implements OnModuleInit {
     private readonly logger = new Logger(CloudinaryService.name);

     constructor(private readonly configService: ConfigService) { }

     onModuleInit(): void {
          const cloudName = this.configService.get<string>('cloudinary.cloudName');
          const apiKey = this.configService.get<string>('cloudinary.apiKey');
          const apiSecret = this.configService.get<string>('cloudinary.apiSecret');

          if (!cloudName || !apiKey || !apiSecret) {
               this.logger.warn(
                    '⚠️ Cloudinary credentials are not fully configured. Uploads will fail at runtime.',
               );
          }

          cloudinary.config({
               cloud_name: cloudName,
               api_key: apiKey,
               api_secret: apiSecret,
               secure: true,
          });

          this.logger.log('✅ Cloudinary configured');
     }

     /**
      * Upload a single image file to Cloudinary.
      */
     async uploadImage(
          file: Express.Multer.File,
          folder: CloudinaryFolder = CLOUDINARY_FOLDERS.PROPERTIES,
     ): Promise<CloudinaryUploadResult> {
          this.validateImageFile(file);
          return this.uploadFile(file, folder, 'image');
     }

     /**
      * Upload a single video file to Cloudinary.
      */
     async uploadVideo(
          file: Express.Multer.File,
          folder: CloudinaryFolder = CLOUDINARY_FOLDERS.VIDEOS,
     ): Promise<CloudinaryUploadResult> {
          this.validateVideoFile(file);
          return this.uploadFile(file, folder, 'video');
     }

     /**
      * Upload a document file to Cloudinary.
      */
     async uploadDocument(
          file: Express.Multer.File,
          folder: CloudinaryFolder = CLOUDINARY_FOLDERS.DOCUMENTS,
     ): Promise<CloudinaryUploadResult> {
          this.validateDocumentFile(file);
          return this.uploadFile(file, folder, 'auto');
     }

     /**
      * Upload multiple image files at once.
      */
     async uploadMultipleImages(
          files: Express.Multer.File[],
          folder: CloudinaryFolder = CLOUDINARY_FOLDERS.PROPERTIES,
     ): Promise<CloudinaryUploadResult[]> {
          if (!files || files.length === 0) {
               throw new BadRequestException('No files provided for upload');
          }
          return Promise.all(files.map((file) => this.uploadImage(file, folder)));
     }

     /**
      * Upload multiple video files at once.
      */
     async uploadMultipleVideos(
          files: Express.Multer.File[],
          folder: CloudinaryFolder = CLOUDINARY_FOLDERS.VIDEOS,
     ): Promise<CloudinaryUploadResult[]> {
          if (!files || files.length === 0) {
               throw new BadRequestException('No files provided for upload');
          }
          return Promise.all(files.map((file) => this.uploadVideo(file, folder)));
     }

     /**
      * Replace an existing file: delete the old one, then upload the new one.
      */
     async replaceFile(
          file: Express.Multer.File,
          oldPublicId: string | null | undefined,
          folder: CloudinaryFolder,
          resourceType: 'image' | 'video' | 'auto' = 'image',
     ): Promise<CloudinaryUploadResult> {
          const uploadResult = await this.uploadFile(file, folder, resourceType);

          if (oldPublicId) {
               await this.deleteFile(oldPublicId).catch((err) => {
                    this.logger.warn(`Failed to delete old file ${oldPublicId}: ${err.message}`);
               });
          }

          return uploadResult;
     }

     /**
      * Delete a file from Cloudinary by its public ID.
      */
     async deleteFile(
          publicId: string,
          resourceType: 'image' | 'video' | 'raw' = 'image',
     ): Promise<boolean> {
          try {
               const result = await cloudinary.uploader.destroy(publicId, {
                    resource_type: resourceType,
               });
               this.logger.log(`Deleted Cloudinary file: ${publicId}`);
               return result.result === 'ok';
          } catch (error) {
               this.logger.error(
                    `Failed to delete Cloudinary file ${publicId}: ${error instanceof Error ? error.message : String(error)}`,
               );
               throw error;
          }
     }

     /**
      * Delete multiple files by their public IDs.
      */
     async deleteMultipleFiles(
          publicIds: string[],
          resourceType: 'image' | 'video' | 'raw' = 'image',
     ): Promise<boolean[]> {
          if (!publicIds || publicIds.length === 0) return [];
          return Promise.all(publicIds.map((id) => this.deleteFile(id, resourceType)));
     }

     /**
      * Extract the public ID from a Cloudinary URL.
      */
     extractPublicId(url: string): string | null {
          if (!url) return null;
          try {
               const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|gif|webp|mp4|mov|avi|pdf|doc|docx)$/i);
               return matches ? matches[1] : null;
          } catch {
               return null;
          }
     }

     // ==================== PRIVATE HELPERS ====================

     private async uploadFile(
          file: Express.Multer.File,
          folder: CloudinaryFolder,
          resourceType: 'image' | 'video' | 'auto',
     ): Promise<CloudinaryUploadResult> {
          return new Promise<CloudinaryUploadResult>((resolve, reject) => {
               const uploadStream = cloudinary.uploader.upload_stream(
                    {
                         folder: `property-chai/${folder}`,
                         resource_type: resourceType,
                         unique_filename: true,
                         overwrite: false,
                    },
                    (
                         error: UploadApiErrorResponse | undefined,
                         result: UploadApiResponse | undefined,
                    ) => {
                         if (error || !result) {
                              this.logger.error(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`);
                              return reject(
                                   new BadRequestException(
                                        `File upload failed: ${error?.message || 'Unknown error'}`,
                                   ),
                              );
                         }
                         resolve({
                              url: result.url,
                              secureUrl: result.secure_url,
                              publicId: result.public_id,
                              format: result.format,
                              resourceType: result.resource_type,
                              bytes: result.bytes,
                              width: result.width,
                              height: result.height,
                              duration: result.duration,
                         });
                    },
               );

               const readableStream = new Readable({
                    read() {
                         this.push(file.buffer);
                         this.push(null);
                    },
               });
               readableStream.pipe(uploadStream);
          });
     }

     private validateImageFile(file: Express.Multer.File): void {
          const allowedMimeTypes = [
               'image/jpeg',
               'image/jpg',
               'image/png',
               'image/gif',
               'image/webp',
          ];
          if (!allowedMimeTypes.includes(file.mimetype)) {
               throw new BadRequestException(
                    `Invalid image type: ${file.mimetype}. Allowed: jpeg, jpg, png, gif, webp`,
               );
          }
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
               throw new BadRequestException('Image size exceeds 10MB limit');
          }
     }

     private validateVideoFile(file: Express.Multer.File): void {
          const allowedMimeTypes = [
               'video/mp4',
               'video/quicktime',
               'video/x-msvideo',
               'video/webm',
          ];
          if (!allowedMimeTypes.includes(file.mimetype)) {
               throw new BadRequestException(
                    `Invalid video type: ${file.mimetype}. Allowed: mp4, mov, avi, webm`,
               );
          }
          const maxSize = 100 * 1024 * 1024; // 100MB
          if (file.size > maxSize) {
               throw new BadRequestException('Video size exceeds 100MB limit');
          }
     }

     private validateDocumentFile(file: Express.Multer.File): void {
          const allowedMimeTypes = [
               'application/pdf',
               'application/msword',
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
               'application/vnd.ms-excel',
               'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
               'text/plain',
          ];
          if (!allowedMimeTypes.includes(file.mimetype)) {
               throw new BadRequestException(
                    `Invalid document type: ${file.mimetype}. Allowed: pdf, doc, docx, xls, xlsx, txt`,
               );
          }
          const maxSize = 20 * 1024 * 1024; // 20MB
          if (file.size > maxSize) {
               throw new BadRequestException('Document size exceeds 20MB limit');
          }
     }
}
