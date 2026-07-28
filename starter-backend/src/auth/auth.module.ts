import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
     imports: [
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.registerAsync({
               imports: [ConfigModule],
               inject: [ConfigService],
               useFactory: (config: ConfigService) => ({
                    secret: config.get<string>('jwt.secret', 'super-secret-key'),
                    signOptions: {
                         expiresIn: config.get<string>('jwt.expiresIn', '1d'),
                    },
               }),
          }),
          AuditLogModule,
     ],
     controllers: [AuthController],
     providers: [AuthService, JwtStrategy],
     exports: [AuthService, JwtModule],
})
export class AuthModule { }
