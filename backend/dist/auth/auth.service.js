"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const redis_service_1 = require("../redis/redis.service");
const crypto_1 = require("crypto");
const jwt_secret_1 = require("./jwt-secret");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService, redisService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.SALT_ROUNDS = 12;
        this.ACCESS_TOKEN_EXPIRY = '15m';
        this.REFRESH_TOKEN_EXPIRY = '7d';
        this.SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
    }
    async register(email, password, name) {
        const normalizedEmail = email.trim().toLowerCase();
        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        // Validate password strength
        this.validatePasswordStrength(password);
        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        // Create new user
        const user = this.usersRepository.create({
            email: normalizedEmail,
            password: hashedPassword,
            name: name.trim(),
        });
        const savedUser = await this.usersRepository.save(user);
        const sessionId = (0, crypto_1.randomUUID)();
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
    async login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        // Find user by email
        const user = await this.usersRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const sessionId = (0, crypto_1.randomUUID)();
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
    async refresh(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: (0, jwt_secret_1.getJwtSecret)(),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (!payload.sid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const session = await this.redisService.getSession(payload.sid);
        if (!session) {
            throw new common_1.UnauthorizedException('Session not found');
        }
        const tokenMatches = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (!tokenMatches) {
            await this.redisService.deleteSession(payload.sid);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.validateUser(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
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
    async logout(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: (0, jwt_secret_1.getJwtSecret)(),
                ignoreExpiration: true,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        if (!payload.sid) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        await this.redisService.deleteSession(payload.sid);
        return { success: true };
    }
    async validateUser(id) {
        return this.usersRepository.findOne({
            where: { id },
        });
    }
    async verifySession(sessionId) {
        const session = await this.redisService.getSession(sessionId);
        return !!session;
    }
    async createSessionTokens(userId, email, sessionId) {
        const payload = {
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
        const sessionRecord = {
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
    validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (password.length < minLength ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasNumbers ||
            !hasSpecialChar) {
            throw new common_1.UnauthorizedException('Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map