# health

## smoke

```bash
k6 run health/1.smoke.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/

     execution: local
        script: health/1.smoke.js
        output: -

     scenarios: (100.00%) 1 scenario, 2 max VUs, 1m30s max duration (incl. graceful stop):
              * breaking: Up to 2 looping VUs for 1m0s over 1 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✓ 'p(99)<1000' p(99)=172.03µs

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 619875  10331.221318/s
    checks_succeeded...: 100.00% 619875 out of 619875
    checks_failed......: 0.00%   0 out of 619875

    ✓ response code was 200

    HTTP
    http_req_duration..............: avg=54.72µs min=33.67µs med=49.15µs max=6.86ms p(90)=65.57µs p(95)=77.87µs
      { expected_response:true }...: avg=54.72µs min=33.67µs med=49.15µs max=6.86ms p(90)=65.57µs p(95)=77.87µs
    http_req_failed................: 0.00%  0 out of 619875
    http_reqs......................: 619875 10331.221318/s

    EXECUTION
    iteration_duration.............: avg=92.68µs min=59.61µs med=83.84µs max=7.01ms p(90)=111.3µs p(95)=131.49µs
    iterations.....................: 619875 10331.221318/s
    vus............................: 1      min=1           max=1
    vus_max........................: 2      min=2           max=2

    NETWORK
    data_received..................: 198 MB 3.3 MB/s
    data_sent......................: 73 MB  1.2 MB/s




running (1m00.0s), 0/2 VUs, 619875 complete and 0 interrupted iterations
breaking ✓ [======================================] 0/2 VUs  1m0s
```
