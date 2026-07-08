# services/

Business logic layer. Routes call functions here instead of containing logic themselves. Everything in this folder reads/writes data via utils/recordsStorage.js — no direct fs calls happen here.


## parkingChecks.js

Shared, reusable validation rules used across service functions. Kept separate from createParkingRecord.js so other services (e.g. an update/release function) can reuse the same checks without duplicating logic.

These functions are not async — they don't read the file themselves. They receive an already-fetched records array from whichever service calls them. This avoids reading records.json more than once per request.

### doubleParking(records, licensePlate)

Checks whether a given license plate already has an active parking record.

- Rule: a car cannot be parked twice while already active
- Returns: true if a record exists where licensePlate matches AND status === "parked", otherwise false

### lotFull(records, lotNumber)

Checks whether a given lot is currently occupied.

- Rule: a lot cannot receive a car if it's already occupied
- Returns: true if a record exists where lotNumber matches AND status === "parked", otherwise false


## createParkingRecord.js

### createParkingRecord(data)

Creates a new parking record after validating against the rules in parkingChecks.js.

Input (data): licensePlate, vehicleType, lotNumber, expectedTimeOut — as provided by the client (Routes layer passes the request body through unchanged).

Flow:
1. Read all records once (readRecords())
2. Run doubleParking() — if true, return 409
3. Run lotFull() — if true, return 409
4. Build the new record — client fields + server-generated fields (id via randomUUID(), status: "parked", createdAt/updatedAt timestamps, actualTimeOut: null)
5. Save the updated array (writeRecords()) — write failures are caught and converted to 500, not left as an uncaught throw
6. Return 201 + the new record

Return shape — every path, success or failure, returns the same structure:

{ statusCode: number, message: string, record?: object }

This consistency matters: the Routes layer doesn't need separate logic to detect "did this succeed or fail" — it just reads statusCode off whatever this function returns and responds accordingly.

statusCode = Meaning = When

201 = Created = Record successfully saved

409 = Conflict = Car already parked, or lot already occupied

 500 = Server error = writeRecords() failed (disk/permissions issue)


## getAvailableLots.js

### getAvailableLots()

Answers "which lots are free right now?" — this is not a simple filter (only "parked"/"unparked"). Instead it calculates: full lot list (TOTAL_LOTS constant, generated via Array.from, not hardcoded) minus lots currently occupied by a "parked" record.

Returns: { statusCode: 200, message, lots: [...] }

## getParkingRecords.js

### getParkingRecords(status)

Handles GET /parking-records and GET /parking-records?status=...

- Normalizes status to lowercase (so Free, FREE, parked etc. all work)
- status=free → delegates to getAvailableLots() (not duplicated logic)
- status=parked or status=unparked → filters records
- No status → returns all records
- Anything else → 400

## getParkingRecordById.js

### getParkingRecordById(id)

Handles GET /parking-records/:id. Uses .find() (not .some()/.filter()) since the caller needs the actual matching record, not a boolean or an array. Returns 404 if no match.

## updateParkingRecord.js

### updateParkingRecord(id, data)

Handles PUT /parking-records/:id. Accepts a partial body — only the fields the client wants to change.

Validation branches based on which fields are present in data (checked via Object.hasOwn()):

- status: "unparked" present enforces rule 3: rejects with 409 if the record isn't currently "parked"
- lotNumber present: checks lotOccupiedByAnother() (from parkingChecks.js) → rejects with 409 if another active record already holds that lot. Excludes the record's own current lot, so a car isn't blocked by itself.

Only the fields actually sent are updated; everything else on the record is left untouched. updatedAt is always refreshed regardless of which fields changed.

Scope note: re-sending status: "parked" when already "parked" is currently allowed (not prohibited by any locked rule). Flagged for the team, not blocked by default.


## deactivateRecord.js

### deactivateRecord(id)

Handles DELETE /parking-records/:id — soft delete, not permanent removal. Always ends with status: "unparked", and succeeds even if the record was already unparked, rather than erroring on a repeat call.


## parkingChecks.js — full function list

Function = Used by = Purpose
doubleParking(records, licensePlate) = createParkingRecord = Blocks creating a record for a plate that's already parked
lotFull(records, lotNumber) = createParkingRecord = Blocks creating a record for an already-occupied lot
lotOccupiedByAnother(records, lotNumber, currentRecordId) = updateParkingRecord = Same idea as lotFull, but excludes the record being updated, needed because a car relocating shouldn't be blocked by its own current lot

doubleParking and lotFull are business rules, reusable, independent of "creating" anything. createParkingRecord is a workflow that uses those rules plus does its own thing (builds and saves a record). Separating them means a future service (e.g. releasing a lot on PUT) can import and reuse the same rule checks without copy-pasting logic.