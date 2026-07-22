# Privacy and security

The app makes no application network requests. Patterns and leaderboard names remain in browser memory or localStorage. The copied share URL contains a base64url-style encoding of `{ "challenge": "arena-XX" }` only; it contains no answer, score, pattern, or hidden tests.

JavaScript regular expressions can consume excessive CPU. Each run is executed in a dedicated Web Worker with a parent-side 250 ms timeout that terminates and recreates the worker. This prevents a frozen application page but does not make arbitrary regexes safe for a server. Keep server-side execution outside this design.
