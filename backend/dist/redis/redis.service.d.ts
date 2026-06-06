import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private client;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    setSession(sessionId: string, session: Record<string, any>, ttlSeconds: number): Promise<void>;
    getSession(sessionId: string): Promise<Record<string, any> | null>;
    deleteSession(sessionId: string): Promise<void>;
}
//# sourceMappingURL=redis.service.d.ts.map