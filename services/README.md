# services/

Business logic layer.
Routes call functions here instead of containing logic themselves.
Everything in this folder reads/writes data via utils/recordsStorage.js — no direct fs calls happen here.

## parkingChecks.js

Shared, reusable validation rules used across service functions.
Kept separate from createParkingRecord.js so other services (e.g. an update/release function) can reuse the same checks without duplicating logic.

These functions are NOT async — they don't read the file themselves.
They receive an already-fetched `records` array from whichever service calls them.
This avoids reading records.json more than once per request.

### doubleParking(records, licensePlate)

Checks whether a given license plate already has an active parking record.

- **Rule:** a car cannot be parked twice while already active
- **Returns:** `true` if a record exists where `licensePlate` matches AND `status === "parked"`, otherwise `false`

### lotFull(records, lotNumber)

Checks whether a given lot is currently occupied.

Rule: a lot cannot receive a car if it's already occupied

Returns: `true` if a record exists where `lotNumber` matches AND `status === "parked"`, otherwise `false`

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


The Routes layer doesn't need separate logic to detect "did this succeed or fail" — it just reads statusCode off whatever this function returns and responds accordingly.

  statusCode  Meaning  When
  201 = Created = Record successfully saved
  409 = Conflict = Car already parked, or lot already occupied
  500 = Server error = writeRecords failed (disk/permissions issue)


## Why the split between parkingChecks.js and createParkingRecord.js?

doubleParking and lotFull are business rules (reusable, independent of "creating" anything). createParkingRecord is a workflow that uses those rules plus does its own thing (builds and saves a record). Separating them means a future service (e.g. releasing a lot on PUT) can import and reuse the same rule checks without copy-pasting logic.