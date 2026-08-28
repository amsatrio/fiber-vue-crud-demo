// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s over the long run
    },
    scenarios: {
        // define scenarios
        soak: {
            executor: 'ramping-vus',
            stages: [
                { duration: '5m', target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
                { duration: '8h', target: 100 }, // stay at 100 users for 8 hours!!!
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
