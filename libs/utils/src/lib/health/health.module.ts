import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
        }),
    ],
    providers: [ShutdownService, ShutdownHealthIndicator],
    controllers: [HealthController],
})
export class HealthModule {}
