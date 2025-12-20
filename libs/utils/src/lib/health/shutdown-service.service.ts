import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
    private static isShuttingDown = false;
    private readonly logger = new Logger(ShutdownService.name);

    constructor(private readonly configService: ConfigService) {}

    async onApplicationShutdown(signal?: string): Promise<void> {
        this.logger.log(`Received shutdown signal: ${signal}. Starting graceful shutdown.`, 'ShutdownService');

        ShutdownService.isShuttingDown = true;

        const shutdownDelay = this.configService.getOrThrow<number>('SHUTDOWN_DELAY_MS', 10000); // Default to 10s
        this.logger.log(`Waiting ${shutdownDelay}ms for traffic to drain...`, 'ShutdownService');
        await new Promise(resolve => setTimeout(resolve, shutdownDelay));

        this.logger.log('Graceful shutdown period finished. Application will now close.', 'ShutdownService');
    }

    isHealthy(): boolean {
        return !ShutdownService.isShuttingDown;
    }
}
