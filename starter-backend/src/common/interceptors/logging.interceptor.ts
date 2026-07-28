import {
     CallHandler,
     ExecutionContext,
     Injectable,
     Logger,
     NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

/**
 * Logging Interceptor
 * Logs every API request and response with method, URL, and duration.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
     private readonly logger = new Logger('HTTP');

     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
          const request = context.switchToHttp().getRequest<Request>();
          const { method, url, ip } = request;
          const userAgent = request.get('user-agent') || 'unknown';
          const now = Date.now();

          this.logger.log(`→ ${method} ${url} | IP: ${ip} | UA: ${userAgent}`);

          return next.handle().pipe(
               tap({
                    next: (data) => {
                         const duration = Date.now() - now;
                         this.logger.log(`← ${method} ${url} | ${duration}ms | OK`);
                    },
                    error: (error) => {
                         const duration = Date.now() - now;
                         this.logger.error(
                              `← ${method} ${url} | ${duration}ms | ERROR: ${error.message}`,
                         );
                    },
               }),
          );
     }
}
