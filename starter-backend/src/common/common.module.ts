import { Global, Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
     imports: [PrismaModule],
     providers: [
          GlobalExceptionFilter,
          LoggingInterceptor,
          TransformInterceptor,
     ],
     exports: [PrismaModule, GlobalExceptionFilter, LoggingInterceptor, TransformInterceptor],
})
export class CommonModule { }
