# Architecture

```text
React UI → Worker client → disposable Worker → core evaluator
    ↓              ↓                    ↓
localStorage   250 ms timeout       challenge fixtures
```

The core is deterministic and browser-independent: challenge data, input validation, execution interpretation, and scoring are plain TypeScript. The Worker is an external execution adapter. The client terminates the entire Worker when its timer expires; a new worker is created before the next request. Browser-local persistence is isolated in the leaderboard adapter. This separation allows core tests to run without UI or network access.
