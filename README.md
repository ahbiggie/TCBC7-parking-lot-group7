# TCBC7-parking-lot-group7

TechCrush Backend Cohort 7 — Collaborative Parking Lot Mini Project.

## Team Members & Contributions

- **Shaibu Yusuf Lawal** (Team Lead) — File Storage (Service logic) Integration & PR review
- **Rufai Abdulrahamon Oluwadamilare** — Routes (GET/POST)
- **Sanmi Livingstone** — Validation (Business rules) & PR Review
- **Seth Asamaige** — README & PR Review
- **Simon Ebelethe** — File Storage (Service logic)
- **Triumph Oroboghene Smart** — Validation (Field-level checks)
- **Uchenna Opara** — Testing (Postman)
- **Uduak Umanah** — Routes (PUT/DELETE)
- **Victor Olusegun** — File Storage (JSON read/write)


## What this project does

REST API for managing a parking lot — park and unpark vehicles, track lot occupancy, and calculate available slots. Built with Node.js and Express. Data is persisted in a JSON file (no database).


## How to run it

1. Clone the repo:
   ```
   git clone https://github.com/ahbiggie/TCBC7-parking-lot-group7
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart on file changes:
   ```
   npm run dev
   ```

The server runs on `http://localhost:3000`.

---

## Endpoints

Base URL: `http://localhost:3000`

### `GET /parking-records`
Returns all parking records. Supports an optional `?status=` query:
- `?status=parked` — only currently parked vehicles
- `?status=unparked` — only unparked/released records
- `?status=free` — returns available lot numbers instead of records

**Example request:**
```
GET /parking-records
```
**Example response (200):**
```json
{
  "statusCode": 200,
  "message": "Parking records retrieved successfully.",
  "records": []
}
```

### `GET /parking-records/:id`
Returns a single record by ID.

**Example request:**
```
GET /parking-records/3f9a2c3b-1234-4a5b-9c8d-abcdef123456
```
**Example response (200):**
```json
{
  "statusCode": 200,
  "message": "Parking record retrieved successfully.",
  "record": {
    "id": "3f9a2c3b-1234-4a5b-9c8d-abcdef123456",
    "licensePlate": "LAG-123AA",
    "vehicleType": "sedan",
    "lotNumber": "A1",
    "status": "parked",
    "createdAt": "2026-07-08T18:30:00.000Z",
    "updatedAt": "2026-07-08T18:30:00.000Z",
    "expectedTimeOut": "2026-07-08T20:00:00Z",
    "actualTimeOut": null
  }
}
```
**Example response (404):**
```json
{
  "statusCode": 404,
  "message": "Parking record not found."
}
```

### `POST /parking-records`
Parks a vehicle (creates a new record). Requires `licensePlate`, `vehicleType`, `lotNumber`, `expectedTimeOut` in the request body.

**Example request:**
```json
POST /parking-records
{
  "licensePlate": "LAG-123AA",
  "vehicleType": "sedan",
  "lotNumber": "A1",
  "expectedTimeOut": "2026-07-08T20:00:00Z"
}
```
**Example response (201):**
```json
{
  "statusCode": 201,
  "message": "Parking record created successfully.",
  "record": {
    "id": "3f9a2c3b-1234-4a5b-9c8d-abcdef123456",
    "licensePlate": "LAG-123AA",
    "vehicleType": "sedan",
    "lotNumber": "A1",
    "status": "parked",
    "createdAt": "2026-07-08T18:30:00.000Z",
    "updatedAt": "2026-07-08T18:30:00.000Z",
    "expectedTimeOut": "2026-07-08T20:00:00Z",
    "actualTimeOut": null
  }
}
```
**Example response (409 — already parked or lot occupied):**
```json
{
  "statusCode": 409,
  "message": "Vehicle is already parked."
}
```

### `PUT /parking-records/:id`
Updates a record — accepts a partial body. Used to unpark a vehicle (`status: "unparked"`), relocate it to another lot (`lotNumber`), or record `actualTimeOut`.

**Example request (unparking):**
```json
PUT /parking-records/3f9a2c3b-1234-4a5b-9c8d-abcdef123456
{
  "status": "unparked",
  "actualTimeOut": "2026-07-08T19:45:00Z"
}
```
**Example response (200):**
```json
{
  "statusCode": 200,
  "message": "Parking record updated successfully.",
  "record": {
    "id": "3f9a2c3b-1234-4a5b-9c8d-abcdef123456",
    "licensePlate": "LAG-123AA",
    "vehicleType": "sedan",
    "lotNumber": "A1",
    "status": "unparked",
    "createdAt": "2026-07-08T18:30:00.000Z",
    "updatedAt": "2026-07-08T19:45:00.000Z",
    "expectedTimeOut": "2026-07-08T20:00:00Z",
    "actualTimeOut": "2026-07-08T19:45:00Z"
  }
}
```

### `DELETE /parking-records/:id`
Soft-deletes a record — sets `status` to `"unparked"` rather than removing it, to preserve parking history. Idempotent: calling it on an already-unparked record still returns success.

**Example request:**
```
DELETE /parking-records/3f9a2c3b-1234-4a5b-9c8d-abcdef123456
```
**Example response (200):**
```json
{
  "statusCode": 200,
  "message": "Parking record deactivated successfully.",
  "record": {
    "id": "3f9a2c3b-1234-4a5b-9c8d-abcdef123456",
    "status": "unparked",
    "updatedAt": "2026-07-08T19:50:00.000Z"
  }
}
```

---

## Known Issues

- Fee calculation not yet implemented (bonus)
- No database — data resets only if `data/records.json` is deleted (otherwise it persists across restarts)

---

## Tech Stack

- Node.js
- Express.js
- ES Modules
- JSON file storage (`fs/promises`)
- Git & GitHub