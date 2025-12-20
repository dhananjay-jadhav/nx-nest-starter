import axios from 'axios';

describe('Health Endpoints', () => {
    describe('GET /health/liveness', () => {
        it('should return healthy status', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.status).toBe(200);
            expect(res.data).toMatchObject({
                status: 'ok',
                details: {},
            });
        });

        it('should have correct response structure', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.data).toHaveProperty('status');
            expect(res.data).toHaveProperty('info');
            expect(res.data).toHaveProperty('error');
            expect(res.data).toHaveProperty('details');
        });
    });

    describe('GET /health/readiness', () => {
        it('should return healthy status when application is ready', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.status).toBe(200);
            expect(res.data.status).toBe('ok');
        });

        it('should include application_status in details', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data.details).toHaveProperty('application_status');
            expect(res.data.details.application_status).toMatchObject({
                status: 'up',
            });
        });

        it('should have correct response structure', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data).toHaveProperty('status');
            expect(res.data).toHaveProperty('info');
            expect(res.data).toHaveProperty('error');
            expect(res.data).toHaveProperty('details');
        });

        it('should include application_status in info when healthy', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data.info).toHaveProperty('application_status');
            expect(res.data.info.application_status).toMatchObject({
                status: 'up',
            });
        });
    });
});
