# TCBC7-parking-lot-group7

TechCrush Backend Cohort 7 — Collaborative Parking Lot Mini Project.

---

## Team Members & Contributions

- **Shaibu Yusuf Lawal** (Team Lead) - File Storage (Service logic) & Integration
- **Rufai Abdulrahamon Oluwadamilare** - Routes (GET/POST)
- **Sanmi Livingstone** - Validation (Business rules)
- **Seth Asamaige** - README
- **Simon Ebelethe** - File Storage (Service logic)
- **Triumph Oroboghene Smart** - Validation (Field-level checks)
- **Uchenna Opara** - Testing (Postman)
- **Uduak Umanah** - Routes (PUT/DELETE) 
- **Victor Olusegun** - File Storage (JSON read/write)

---

## What this project does

Simple API for managing a parking lot. Built with Node.js and Express. Data is stored in a JSON file.

---

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
   node app.js
   ```

The server runs on `http://localhost:3000`

---

## Endpoints

### GET /api/v1/parking-records
Returns all parking records.

### GET /api/v1/parking-records/:id
Returns a single record by ID.

### POST /api/v1/parking-records
Parks a vehicle. Requires licensePlate, vehicleType, lotNumber, expectedTimeOut in the request body.

### PUT /api/v1/parking-records/:id
Updates a record — used when a vehicle unparks.

### DELETE /api/v1/parking-records/:id
Soft deletes a record (status change, not permanent removal).

---

## Known Issues

- Fee calculation not implemented yet (bonus)
- No actual database — data resets when server restarts

---

## Tech Stack

- Node.js
- Express.js
- ES Modules
- JSON file storage (fs/promises)
- Git & GitHub