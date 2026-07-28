import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { CLOUDINARY_FOLDERS } from '../constants';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

/**
 * Converts a date string (date-only like "2025-02-05" or full ISO-8601) into a
 * `Date` instance, or `null` when the value is empty/undefined.
 *
 * Prisma 7.x rejects date-only strings for `DateTime` fields with
 * "premature end of input. Expected ISO-8601 DateTime", so HTML `<input
 * type="date">` values (which are always date-only) must be coerced to a
 * `Date` before being passed to `prisma.*.create/update`.
 */
export function toDate(value: string | Date | null | undefined): Date | null {
     if (value === null || value === undefined || value === '') return null;
     if (value instanceof Date) return value;
     const date = new Date(value);
     if (Number.isNaN(date.getTime())) return null;
     return date;
}

/**
 * Multipart media files grouped by kind.
 * Each kind is optional and may contain zero or more uploaded files.
 */
export interface MediaFiles {
     images?: Express.Multer.File[];
     videos?: Express.Multer.File[];
     documents?: Express.Multer.File[];
}

/**
 * Cloudinary URLs produced after uploading {@link MediaFiles}.
 */
export interface UploadedMedia {
     images: string[];
     videos: string[];
     documents: string[];
}

/**
 * Deserializes a JSON-encoded multipart "data" field into a validated DTO.
 *
 * When uploading files via multipart/form-data, the non-file payload is
 * serialized as JSON inside a single `data` text field so that rich types
 * (numbers, booleans, arrays, nested objects) survive the multipart boundary
 * intact. This helper parses that JSON and validates it against the provided
 * DTO class, mirroring the global ValidationPipe settings
 * (whitelist / forbidNonWhitelisted / enableImplicitConversion).
 *
 * This avoids the fragile string-coercion that happens when sending many
 * individual FormData text fields (arrays become repeated keys, numbers become
 * strings, etc.) and keeps the existing DTOs + class-validator rules working
 * unchanged.
 */
export async function parseMultipartDto<T extends object>(
     raw: string | undefined,
     dtoClass: new () => T,
): Promise<T> {
     let parsed: unknown;
     try {
          parsed = raw ? JSON.parse(raw) : {};
     } catch {
          throw new BadRequestException('Invalid JSON payload in "data" field');
     }

     const instance = plainToInstance(dtoClass, parsed, {
          enableImplicitConversion: true,
     });

     try {
          await validateOrReject(instance, {
               whitelist: true,
               forbidNonWhitelisted: true,
          });
     } catch (errors) {
          throw new BadRequestException(formatValidationErrors(errors as ValidationError[]));
     }

     return instance;
}

/**
 * Uploads multipart media files to Cloudinary and returns the resulting URLs.
 *
 * Used by property/rental/room services during create/update so that files are
 * only persisted to Cloudinary when the request actually succeeds — never when
 * a user merely picks a file in the form (which was the orphaned-file problem
 * with the old immediate-upload MediaUploader).
 *
 * @param keep Existing URLs to retain (e.g. images the user kept while editing).
 *             Newly uploaded URLs are appended after these.
 */
export async function uploadMediaFiles(
     cloudinaryService: CloudinaryService,
     files: MediaFiles | undefined,
     keep: { images?: string[]; videos?: string[]; documents?: string[] } = {},
): Promise<UploadedMedia> {
     const uploadedImages =
          files?.images?.length
               ? await cloudinaryService.uploadMultipleImages(files.images, CLOUDINARY_FOLDERS.PROPERTIES)
               : [];
     const uploadedVideos =
          files?.videos?.length
               ? await cloudinaryService.uploadMultipleVideos(files.videos, CLOUDINARY_FOLDERS.VIDEOS)
               : [];
     const uploadedDocuments =
          files?.documents?.length
               ? await Promise.all(
                    files.documents.map((f) =>
                         cloudinaryService.uploadDocument(f, CLOUDINARY_FOLDERS.DOCUMENTS),
                    ),
               )
               : [];

     return {
          images: [...(keep.images ?? []), ...uploadedImages.map((r) => r.secureUrl)],
          videos: [...(keep.videos ?? []), ...uploadedVideos.map((r) => r.secureUrl)],
          documents: [...(keep.documents ?? []), ...uploadedDocuments.map((r) => r.secureUrl)],
     };
}

function formatValidationErrors(errors: ValidationError[]): string[] {
     const messages: string[] = [];
     for (const error of errors) {
          if (error.constraints) {
               messages.push(...Object.values(error.constraints));
          }
          if (error.children?.length) {
               messages.push(...formatValidationErrors(error.children));
          }
     }
     return messages.length ? messages : ['Validation failed'];
}
