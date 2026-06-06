import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RedisService } from '../redis/redis.service';
export interface JwtPayload {
    sub: number;
    email: string;
    sid?: string;
    iat?: number;
    exp?: number;
}
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private redisService;
    private readonly SALT_ROUNDS;
    private readonly ACCESS_TOKEN_EXPIRY;
    private readonly REFRESH_TOKEN_EXPIRY;
    private readonly SESSION_TTL_SECONDS;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, redisService: RedisService);
    register(email: string, password: string, name: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    validateUser(id: number): Promise<User | null>;
    verifySession(sessionId: string): Promise<boolean>;
    private createSessionTokens;
    private validatePasswordStrength;
}
//# sourceMappingURL=auth.service.d.ts.map