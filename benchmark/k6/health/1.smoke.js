// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
    },
    scenarios: {
        // define scenarios
        smoke: {
            executor: 'ramping-vus',
            stages: [
                // Key for Smoke test. Keep it at 2, 3, max 5 VUs
                // This can be shorter or just a few iterations
                { duration: '1m', target: 2 },

            ],
        },
    },
};

export default function () {
    // define URL
    const url = 'http://localhost:9001/v1/health/status';

    // send a get request and save response as a variable
    const res = http.get(url);

    // check that response is 200
    check(res, {
        'response code was 200': (r) => r.status === 200,
    });
}
