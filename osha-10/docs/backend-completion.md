# Sending training results to the website

Set this public configuration in `.env.local`, then restart Vite or rebuild:

```dotenv
VITE_TRAINING_COMPLETION_URL=/api/training/completions
```

When unset, backend reporting is disabled. This value is embedded at build time;
do not put secrets in Vite environment variables. The endpoint must be implemented
by the website backend; this repository contains only the game client.

On completion of Module 1 or 2, the game POSTs JSON:

```json
{
  "submissionId": "a-client-generated-uuid",
  "moduleId": "module-2",
  "completed": true,
  "score": 80,
  "elapsedSeconds": 342
}
```

Elapsed seconds are whole seconds from pressing Start to completion, including
time in activity dialogs and background tabs. The score is the final points
total, not a percentage; negative scores are possible. Future modules using the
shared completion callback inherit this integration.

The backend should:

- Authenticate the learner from the website session. Requests include cookies;
  no learner ID or secret is embedded in the game.
- Validate module ID, completion, score, and elapsed seconds against its attempt
  rules. Client results are not authoritative proof of training completion.
- Store results with a unique constraint on learner and submission ID. Repeated
  requests for the same submission must return success without creating another
  record. Each new page load/playthrough gets a new submission ID.
- Return a 2xx response only after saving successfully (204 is sufficient).
  Return non-2xx for errors; do not redirect unauthenticated API calls to an HTML
  login page. The client does not require or parse a response body.
- Apply the website's CSRF protection. If it requires a CSRF token header, wire
  that into the request using the website's token mechanism during integration.

The completion dialog shows saving/success/failure status. Exit is temporarily
disabled during the request (10-second timeout); on failure the learner can retry
or exit. Retries preserve the original result and submission ID. Pending results
are kept in memory only: closing or refreshing the page can lose an unsaved
result. `keepalive` allows an already-started request to continue during navigation
where supported, but does not guarantee delivery.

A relative endpoint uses the game's origin, including when embedded in an iframe.
For a game hosted on another origin, set the full HTTPS API URL and configure the
backend's credentialed CORS policy for the game's exact origin, POST, and the
Content-Type header. Browser cookie restrictions may prevent cross-site sessions;
hosting the game on the website's origin is the simplest session integration.

Local Vite development needs a reachable API URL with appropriate CORS or a
separately configured development proxy. Vite itself does not implement the API.

Run `npm test` for request, retry, deduplication, timeout, and timer checks.
