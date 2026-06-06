"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
const config_1 = require("@nestjs/config");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.client = (0, redis_1.createClient)({
            url: this.configService.get('REDIS_URL') || 'redis://localhost:6379',
        });
        this.client.on('error', (err) => this.logger.error('Redis error', err));
    }
    async onModuleInit() {
        await this.client.connect();
        this.logger.log('Redis connected');
    }
    async onModuleDestroy() {
        await this.client.quit();
        this.logger.log('Redis disconnected');
    }
    async setSession(sessionId, session, ttlSeconds) {
        await this.client.set(`session:${sessionId}`, JSON.stringify(session), {
            EX: ttlSeconds,
        });
    }
    async getSession(sessionId) {
        const session = await this.client.get(`session:${sessionId}`);
        return session ? JSON.parse(session) : null;
    }
    async deleteSession(sessionId) {
        await this.client.del(`session:${sessionId}`);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map