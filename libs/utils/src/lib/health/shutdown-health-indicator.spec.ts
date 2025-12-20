import { HealthIndicatorService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

describe('ShutdownHealthIndicator', () => {
    let indicator: ShutdownHealthIndicator;
    let shutdownService: jest.Mocked<ShutdownService>;
    let healthIndicatorService: jest.Mocked<HealthIndicatorService>;

    const mockIndicatorCheck = {
        up: jest.fn(),
        down: jest.fn(),
    };

    beforeEach(async () => {
        const mockShutdownService = {
            isHealthy: jest.fn(),
        };

        const mockHealthIndicatorService = {
            check: jest.fn().mockReturnValue(mockIndicatorCheck),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShutdownHealthIndicator,
                { provide: ShutdownService, useValue: mockShutdownService },
                { provide: HealthIndicatorService, useValue: mockHealthIndicatorService },
            ],
        }).compile();

        indicator = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);
        shutdownService = module.get(ShutdownService);
        healthIndicatorService = module.get(HealthIndicatorService);

        // Reset mocks
        mockIndicatorCheck.up.mockClear();
        mockIndicatorCheck.down.mockClear();
    });

    it('should be defined', () => {
        expect(indicator).toBeDefined();
    });

    describe('isShuttingDown', () => {
        it('should return up status when service is healthy', () => {
            const expectedResult = { application_status: { status: 'up' } };
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue(expectedResult);

            const result = indicator.isShuttingDown('application_status');

            expect(healthIndicatorService.check).toHaveBeenCalledWith('application_status');
            expect(shutdownService.isHealthy).toHaveBeenCalled();
            expect(mockIndicatorCheck.up).toHaveBeenCalled();
            expect(mockIndicatorCheck.down).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should return down status when service is shutting down', () => {
            const expectedResult = {
                application_status: { status: 'down', message: 'Service is shutting down' },
            };
            shutdownService.isHealthy.mockReturnValue(false);
            mockIndicatorCheck.down.mockReturnValue(expectedResult);

            const result = indicator.isShuttingDown('application_status');

            expect(healthIndicatorService.check).toHaveBeenCalledWith('application_status');
            expect(shutdownService.isHealthy).toHaveBeenCalled();
            expect(mockIndicatorCheck.down).toHaveBeenCalledWith({ message: 'Service is shutting down' });
            expect(mockIndicatorCheck.up).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should use the provided key for health check', () => {
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue({ custom_key: { status: 'up' } });

            indicator.isShuttingDown('custom_key');

            expect(healthIndicatorService.check).toHaveBeenCalledWith('custom_key');
        });
    });
});
