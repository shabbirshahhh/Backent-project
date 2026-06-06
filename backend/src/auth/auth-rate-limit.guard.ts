import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, RateLimitRecord>();
  private readonly limit = 10;
  private readonly windowMs = 15 * 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
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
      throw new HttpException('Too many auth attempts. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    record.count += 1;
    return true;
  }
}
