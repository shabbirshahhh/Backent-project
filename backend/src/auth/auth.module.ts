import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RedisModule } from '../redis/redis.module';
import { getJwtSecret } from './jwt-secret';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: getJwtSecret(),
        signOptions: {
          expiresIn: '24h',
          algorithm: 'HS256',
        },
      }),
    }),
    RedisModule,
  ],
  providers: [AuthService, JwtStrategy, AuthRateLimitGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
