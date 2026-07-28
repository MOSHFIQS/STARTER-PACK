import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
     const logger = new Logger('Bootstrap');
     const app = await NestFactory.create(AppModule, {
          bufferLogs: true,
     });

     // Get configuration
     const configService = app.get(ConfigService);
     const port = configService.get<number>('app.port', 5000);
     const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
     const appName = configService.get<string>('app.name', 'Property Chai API');
     const appVersion = configService.get<string>('app.version', '1.0.0');
     const corsOrigin = configService.get<string>('app.corsOrigin', '*');
     const env = configService.get<string>('app.env', 'development');

     // Security headers via Helmet
     app.use(
          helmet({
               crossOriginResourcePolicy: { policy: 'cross-origin' },
               contentSecurityPolicy: false,
          }),
     );

     // Parse cookies (required for HttpOnly auth cookie extraction)
     app.use(cookieParser());

     // Enable CORS
     app.enableCors({
          origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o: string) => o.trim()),
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          credentials: true,
     });

     // Global API prefix
     app.setGlobalPrefix(apiPrefix, {
          exclude: [
               { path: '/', method: RequestMethod.ALL },
               { path: 'health', method: RequestMethod.ALL },
          ],
     });

     // Global validation pipe (fallback; also set via APP_PIPE in AppModule)
     app.useGlobalPipes(
          new ValidationPipe({
               whitelist: true,
               transform: true,
               forbidNonWhitelisted: true,
               transformOptions: {
                    enableImplicitConversion: true,
               },
          }),
     );

     // Swagger / OpenAPI documentation
     const swaggerConfig = new DocumentBuilder()
          .setTitle(appName)
          .setDescription(
               'Enterprise-grade Property & Real-Estate Platform REST API. ' +
               'Authentication uses JWT Bearer tokens. Uploads use multipart/form-data (no Base64).',
          )
          .setVersion(appVersion)
          .addBearerAuth(
               {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Enter your JWT access token',
                    in: 'header',
               },
               'access-token',
          )
          .addTag('Auth', 'Authentication & authorization endpoints')
          .addTag('Users', 'User management endpoints')
          .addTag('Projects', 'Real-estate project endpoints')
          .addTag('Blocks', 'Project block endpoints')
          .addTag('Plots', 'Plot endpoints')
          .addTag('Properties', 'Property listing endpoints')
          .addTag('Rentals', 'Rental listing endpoints')
          .addTag('Rooms', 'Room endpoints')
          .addTag('Inquiries', 'Purchase inquiry / contact admin endpoints')
          .addTag('Reviews', 'Review endpoints')
          .addTag('Notifications', 'Notification endpoints')
          .addTag('Blogs', 'Blog endpoints')
          .addTag('Dashboard', 'Dashboard & analytics endpoints')
          .addTag('Audit Logs', 'Audit log endpoints')
          .addTag('Cloudinary', 'File upload endpoints')
          .build();

     const document = SwaggerModule.createDocument(app, swaggerConfig);
     SwaggerModule.setup('api-docs', app, document, {
          swaggerOptions: {
               persistAuthorization: true,
               docExpansion: 'none',
               filter: true,
               showRequestDuration: true,
          },
          customSiteTitle: `${appName} - Documentation`,
     });

     // Graceful shutdown hooks
     app.enableShutdownHooks();

     // Start the server
     await app.listen(port);

     logger.log(`==================================================`);
     logger.log(`🚀 ${appName} is running!`);
     logger.log(`📦 Environment: ${env}`);
     logger.log(`🌐 Listening on: http://localhost:${port}/${apiPrefix}`);
     logger.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
     logger.log(`==================================================`);
}

bootstrap().catch((error) => {
     // eslint-disable-next-line no-console
     console.error('❌ Failed to bootstrap application:', error);
     process.exit(1);
});
