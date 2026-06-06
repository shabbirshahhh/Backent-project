"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
let AuthRateLimitGuard = class AuthRateLimitGuard {
    constructor() {
        this.attempts = new Map();
        this.limit = 10;
        this.windowMs = 15 * 60 * 1000;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const key = `${request.ip}:${request.path}`;
        const now = Date.now();
        const record = this.attempts.get(key);
        if (!record || record.resetAt <= now) {
            this.attempts.set(key, {
                count: 1,
                resetAt: now + this.windowMs,
            });
            return true;
        }
        if (record.count >= this.limit) {
            throw new common_1.HttpException('Too many auth attempts. Try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        record.count += 1;
        return true;
    }
};
exports.AuthRateLimitGuard = AuthRateLimitGuard;
exports.AuthRateLimitGuard = AuthRateLimitGuard = __decorate([
    (0, common_1.Injectable)()
], AuthRateLimitGuard);
//# sourceMappingURL=auth-rate-limit.guard.js.map