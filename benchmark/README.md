# Portage vs Postal benchmark

This benchmark compares [Postal](https://github.com/postaljs/postal.js) vs Portage.

See the benchmark tests at the `tests` folder.

To run:

```
npm install postal async
node index.js
```

My results:

```
N=1000

Many pattern subscriptions, many publications...
Postal:      5850 ms
Portage:     298 ms
Portage is 5552 ms faster (94.91%)

Many pattern subscriptions, 1 publication...
Postal:      186 ms
Portage:     10 ms
Portage is 176 ms faster (94.62%)

Many specific subscriptions, many publication...
Postal:      5902 ms
Portage:     253 ms
Portage is 5649 ms faster (95.71%)

Many specific subscriptions, 1 publication...
Postal:      880 ms
Portage:     7 ms
Portage is 873 ms faster (99.20%)

One pattern subscriptions, many publications...
Postal:      11 ms
Portage:     19 ms
Postal is 8 ms faster (42.11%)

One specific subscription, many publications...
Postal:      8 ms
Portage:     17 ms
Postal is 9 ms faster (52.94%)

Portage is faster at 4/6 benchmarks
Postal is faster at 2/6 benchmarks
```
