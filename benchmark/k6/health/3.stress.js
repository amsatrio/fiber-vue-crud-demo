// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: ['rate<0.05'], // http errors should be less than 5% (stress degrades performance)
        http_req_duration: ['p(99)<1500'], // 99% of requests should be below 1.5s
    },
    scenarios: {
        // define scenarios
        stress: {
            executor: 'ramping-vus',
            stages: [
                { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
                { duration: '30m', target: 200 }, // stay at higher 200 users for 30 minutes
                { duration: '5m', target: 0 }, // ramp-down to 0 users

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
