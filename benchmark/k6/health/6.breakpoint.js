// import necessary modules
import { check } from 'k6';
import http from 'k6/http';

// define configuration
export const options = {
    // breakpoint tests intentionally push the system past its limits,
    // so no pass/fail thresholds are set — we just observe where it breaks.
    scenarios: {
        // define scenarios
        breakpoint: {
            executor: 'ramping-arrival-rate', // Assure load increase if the system slows
            stages: [
                { duration: '2h', target: 20000 }, // just slowly ramp-up to a HUGE load

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
