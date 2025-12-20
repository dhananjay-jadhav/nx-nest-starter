import { Test, TestingModule } from '@nestjs/testing';

import { ShutdownHealthIndicator } from './shutdown-health-indicator';

describe('ShutdownHealthIndicator', () => {
    let service: ShutdownHealthIndicator;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ShutdownHealthIndicator],
        }).compile();

        service = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
