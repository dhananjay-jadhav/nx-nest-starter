import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ShutdownService } from './shutdown-service.service';

describe('ShutdownService', () => {
    let service: ShutdownService;
    let configService: jest.Mocked<ConfigService>;

    beforeEach(async () => {
        // Reset the static isShuttingDown flag before each test
        // Using Object.assign to access private static property for testing
        (ShutdownService as unknown as { isShuttingDown: boolean }).isShuttingDown = false;

        const mockConfigService = {
            getOrThrow: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ShutdownService, { provide: ConfigService, useValue: mockConfigService }],
        }).compile();

        service = module.get<ShutdownService>(ShutdownService);
        configService = module.get(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isHealthy', () => {
        it('should return true when application is not shutting down', () => {
            expect(service.isHealthy()).toBe(true);
        });

        it('should return false after shutdown is initiated', async () => {
            configService.getOrThrow.mockReturnValue(10); // 10ms delay for fast test

            expect(service.isHealthy()).toBe(true);

            // Start shutdown (don't await to check immediate state)
            const shutdownPromise = service.onApplicationShutdown('SIGTERM');

            // Should be unhealthy immediately after shutdown starts
            expect(service.isHealthy()).toBe(false);

            await shutdownPromise;
        });
    });

    describe('onApplicationShutdown', () => {
        it('should wait for the configured shutdown delay', async () => {
            const shutdownDelay = 50;
            configService.getOrThrow.mockReturnValue(shutdownDelay);

            const startTime = Date.now();
            await service.onApplicationShutdown('SIGTERM');
            const elapsed = Date.now() - startTime;

            expect(elapsed).toBeGreaterThanOrEqual(shutdownDelay - 10); // Allow 10ms tolerance
            expect(configService.getOrThrow).toHaveBeenCalledWith('SHUTDOWN_DELAY_MS', 10000);
        });

        it('should set isShuttingDown to true', async () => {
            configService.getOrThrow.mockReturnValue(10);

            expect(service.isHealthy()).toBe(true);
            await service.onApplicationShutdown('SIGINT');
            expect(service.isHealthy()).toBe(false);
        });

        it('should handle different shutdown signals', async () => {
            configService.getOrThrow.mockReturnValue(10);

            await service.onApplicationShutdown('SIGTERM');
            expect(service.isHealthy()).toBe(false);
        });

        it('should handle undefined signal', async () => {
            configService.getOrThrow.mockReturnValue(10);

            await service.onApplicationShutdown(undefined);
            expect(service.isHealthy()).toBe(false);
        });
    });
});
