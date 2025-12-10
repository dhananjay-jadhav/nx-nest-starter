/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(PinoLogger);

    const config = app.get(ConfigService);

    app.useLogger(logger);

    const port = parseInt(config.getOrThrow('API_PORT', '3000'));
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap()
    .catch(err => {
        Logger.error(`Error at the root level of the application.....`, err);
    })
    .finally(() => {
        Logger.log('Application started successfully......🚀 🚀 ');
    });
