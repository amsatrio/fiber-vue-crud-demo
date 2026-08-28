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
        breaking: {
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
    // define URL and request body
    const url = 'http://localhost:9001/v1/health/status';
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // send a post request and save response as a variable
    const res = http.get(url, params);

    // check that response is 200
    check(res, {
        'response code was 200': (res) => res.status == 200,
    });
}