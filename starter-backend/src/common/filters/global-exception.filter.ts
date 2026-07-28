import {
     ArgumentsHost,
     Catch,
     ExceptionFilter,
     HttpException,
     HttpStatus,
     Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Global Exception Filter
 * Ensures consistent error response format across the entire application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
     private readonly logger = new Logger(GlobalExceptionFilter.name);

     catch(exception: unknown, host: ArgumentsHost): void {
          const ctx = host.switchToHttp();
          const response = ctx.getResponse<Response>();
          const request = ctx.getRequest<Request>();

          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let message = 'Internal server error';
          let errors: Array<Record<string, any>> = [];

          if (exception instanceof HttpException) {
               status = exception.getStatus();
               const res = exception.getResponse();

               if (typeof res === 'string') {
                    message = res;
               } else if (typeof res === 'object' && res !== null) {
                    const r = res as Record<string, any>;
                    message = r.message || message;
                    if (Array.isArray(r.message)) {
                         errors = r.message.map((m: string) => ({ message: m }));
                         message = 'Validation failed';
                    } else if (r.errors) {
                         errors = Array.isArray(r.errors) ? r.errors : [r.errors];
                    }
               }
          } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
               const handled = this.handlePrismaError(exception);
               status = handled.status;
               message = handled.message;
          } else if (exception instanceof Error) {
               message = exception.message;
               this.logger.error(
                    `Unhandled error: ${exception.message}`,
                    exception.stack,
               );
          }

          // Log the error
          this.logger.error(
               `${request.method} ${request.url} -> ${status} | ${message}`,
          );

          response.status(status).json({
               success: false,
               message,
               errors: errors.length ? errors : undefined,
               statusCode: status,
               timestamp: new Date().toISOString(),
               path: request.url,
          });
     }

     private handlePrismaError(
          error: Prisma.PrismaClientKnownRequestError,
     ): { status: number; message: string } {
          switch (error.code) {
               case 'P2002':
                    return {
                         status: HttpStatus.CONFLICT,
                         message: `Duplicate value: ${error.meta?.target as string} already exists`,
                    };
               case 'P2025':
                    return {
                         status: HttpStatus.NOT_FOUND,
                         message: 'Record not found',
                    };
               case 'P2003':
                    return {
                         status: HttpStatus.BAD_REQUEST,
                         message: 'Foreign key constraint failed',
                    };
               case 'P2014':
                    return {
                         status: HttpStatus.BAD_REQUEST,
                         message: 'Invalid relation: required relation would be violated',
                    };
               default:
                    return {
                         status: HttpStatus.INTERNAL_SERVER_ERROR,
                         message: `Database error: ${error.message}`,
                    };
          }
     }
}
