# routes/

Express layer. Handles HTTP concerns only — parsing requests, calling the matching Services function, sending the response. No business logic lives here; if you find yourself writing an if that checks parking rules inside this folder, it belongs in services/ instead.


## parkingRecords.js

One router, mounted at /parking-records in the main app file. All 5 required endpoints.

| Method   | Path    | Full URL                            | Calls                                             |
| -------- | ------- | -----------------------------------| ------------------------------------------------- |
| POST     | /       | POST /parking-records             | createParkingRecord(req.body)                     |
| GET      | /       | GET /parking-records              | getParkingRecords(req.query.status)               |
| GET      | /:id    | GET /parking-records/:id          | getParkingRecordById(req.params.id)               |
| PUT      | /:id    | PUT /parking-records/:id          | updateParkingRecord(req.params.id, req.body)      |
| DELETE   | /:id    | DELETE /parking-records/:id       | deactivateRecord(req.params.id)                   |

### Handler pattern (same shape for all 5)

router.METHOD("/path", async (req, res) => {
    try {
        const result = await someServiceFunction(...);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ statusCode: 500, message: "Internal server error." });
    }
});


Every Services function already returns { statusCode, message, ... } for its own expected failures (404, 409, 400, etc.) — the try/catch here is a safety net for unexpected errors only (a bug, something Services didn't anticipate). console.error logs it for debugging; the client still just gets a generic 500.

### Why relative paths ("/", "/:id"), not "/parking-records"

The prefix is added once, in the main app file:


app.use("/parking-records", parkingRecordsRouter);


Repeating `/parking-records` inside the router itself would duplicate it in the final URL.

### Route ordering

Express matches routes top-to-bottom. Static paths must come before dynamic (:id-style) ones, or the dynamic route can accidentally swallow a request meant for a static path. Currently a non-issue here — there's no static sibling route (getAvailableLots is handled via ?status=free, not a separate path) — but keep this rule in mind if a static route (e.g. /stats) is ever added.

### Requires `express.json()` middleware

req.body is undefined without it. Must be registered in the main app file before the router is mounted:
