# health

```
/usr/bin/wrk -t4 -c128 -d30s http://localhost:9001/v1/health/status -s pipeline.lua --latency -- / 16
Running 30s test @ http://localhost:9001/v1/health/status
  4 threads and 128 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.53ms    5.35ms  60.12ms   87.53%
    Req/Sec   163.41k    25.49k  218.51k    66.64%
  Latency Distribution
     50%    2.61ms
     75%    5.67ms
     90%   11.32ms
     99%   25.62ms
  19549104 requests in 30.09s, 13.25GB read
Requests/sec: 649646.52
Transfer/sec:    451.03MB
```
