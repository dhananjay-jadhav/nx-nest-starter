import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        LoggerModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                pinoHttp: {
                    level: config.getOrThrow('LOG_LEVEL', 'info'),
                    autoLogging: false,
                    quietReqLogger: true,
                    quietResLogger: true,
                    timestamp: (): string => ` "Timestamp" : "${new Date().toISOString()}" `,
                    formatters: {
                        level: label => {
                            return { level: label };
                        },
                    },
                },
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
