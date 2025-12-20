import { HealthCheckResult, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';

describe('HealthController', () => {
    let controller: HealthController;
    let healthCheckService: jest.Mocked<HealthCheckService>;
    let shutdownHealthIndicator: jest.Mocked<ShutdownHealthIndicator>;

    beforeEach(async () => {
        const mockHealthCheckService = {
            check: jest.fn(),
        };

        const mockShutdownHealthIndicator = {
            isShuttingDown: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                { provide: HealthCheckService, useValue: mockHealthCheckService },
                { provide: ShutdownHealthIndicator, useValue: mockShutdownHealthIndicator },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        healthCheckService = module.get(HealthCheckService);
        shutdownHealthIndicator = module.get(ShutdownHealthIndicator);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('liveness', () => {
        it('should return healthy status when application is alive', async () => {
            const expectedResult: HealthCheckResult = {
                status: 'ok',
                details: {},
            };
            healthCheckService.check.mockResolvedValue(expectedResult);

            const result = await controller.liveness();

            expect(result).toEqual(expectedResult);
            expect(healthCheckService.check).toHaveBeenCalledWith([]);
        });
    });

    describe('readiness', () => {
        it('should return healthy status when application is ready', async () => {
            const expectedResult: HealthCheckResult = {
                status: 'ok',
                details: {
                    application_status: { status: 'up' },
                },
            };
            healthCheckService.check.mockResolvedValue(expectedResult);

            const result = await controller.readiness();

            expect(result).toEqual(expectedResult);
            expect(healthCheckService.check).toHaveBeenCalledWith([expect.any(Function)]);
        });

        it('should call shutdownHealthIndicator when checking readiness', async () => {
            const indicatorResult: HealthIndicatorResult = {
                application_status: { status: 'up' },
            };
            shutdownHealthIndicator.isShuttingDown.mockReturnValue(indicatorResult);
            healthCheckService.check.mockImplementation(async indicators => {
                const results = indicators.map(indicator => indicator());
                return {
                    status: 'ok',
                    details: Object.assign({}, ...results),
                };
            });

            await controller.readiness();

            // Extract and call the indicator function to verify it calls shutdownHealthIndicator
            const checkCall = healthCheckService.check.mock.calls[0][0];
            const indicatorFn = checkCall[0] as () => HealthIndicatorResult;
            indicatorFn();

            expect(shutdownHealthIndicator.isShuttingDown).toHaveBeenCalledWith('application_status');
        });
    });
});
