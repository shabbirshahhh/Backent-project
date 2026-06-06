import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthRateLimitGuard implements CanActivate {
    private readonly attempts;
    private readonly limit;
    private readonly windowMs;
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=auth-rate-limit.guard.d.ts.map