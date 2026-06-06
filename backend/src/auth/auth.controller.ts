import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthRateLimitGuard)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.email || !dto.password || !dto.name) {
      throw new BadRequestException('Email, password, and name are required');
    }

    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @UseGuards(AuthRateLimitGuard)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(AuthRateLimitGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    if (!dto.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    if (!dto.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
