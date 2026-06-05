import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
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

  async setSession(sessionId: string, session: Record<string, any>, ttlSeconds: number) {
    await this.client.set(`session:${sessionId}`, JSON.stringify(session), {
      EX: ttlSeconds,
    });
  }

  async getSession(sessionId: string): Promise<Record<string, any> | null> {
    const session = await this.client.get(`session:${sessionId}`);
    return session ? JSON.parse(session) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.client.del(`session:${sessionId}`);
  }
}
