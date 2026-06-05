import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'crypto';

export interface JwtPayload {
  sub: number;
  email: string;
  sid?: string;
  iat?: number;
  exp?: number;
}

interface SessionRecord {
  userId: number;
  email: string;
  refreshTokenHash: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '24h';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async register(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    this.validatePasswordStrength(password);

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await this.usersRepository.save(user);
    const sessionId = randomUUID();
    const tokens = await this.createSessionTokens(savedUser.id, savedUser.email, sessionId);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = randomUUID();
    const tokens = await this.createSessionTokens(user.id, user.email, sessionId);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.sid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.redisService.getSession(payload.sid);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.createSessionTokens(user.id, user.email, payload.sid);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        ignoreExpiration: true,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload.sid) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.redisService.deleteSession(payload.sid);
    return { success: true };
  }

  async validateUser(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async verifySession(sessionId: string): Promise<boolean> {
    const session = await this.redisService.getSession(sessionId);
    return !!session;
  }

  private async createSessionTokens(userId: number, email: string, sessionId: string) {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      sid: sessionId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);
    const sessionRecord: SessionRecord = {
      userId,
      email,
      refreshTokenHash,
      createdAt: new Date().toISOString(),
    };

    await this.redisService.setSession(sessionId, sessionRecord, this.SESSION_TTL_SECONDS);

    return {
      accessToken,
      refreshToken,
    };
  }

  private validatePasswordStrength(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (
      password.length < minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumbers ||
      !hasSpecialChar
    ) {
      throw new UnauthorizedException(
        'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters',
      );
    }
  }
}
