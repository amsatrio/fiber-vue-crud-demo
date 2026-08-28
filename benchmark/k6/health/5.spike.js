// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: ['rate<0.1'], // http errors should be less than 10% (spike may be sudden)
        http_req_duration: ['p(99)<2000'], // 99% of requests should be below 2s
    },
    scenarios: {
        // define scenarios
        spike: {
            executor: 'ramping-vus',
            stages: [
                { duration: '2m', target: 2000 }, // fast ramp-up to a high point
                // No plateau
                { duration: '1m', target: 0 }, // quick ramp-down to 0 users

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
