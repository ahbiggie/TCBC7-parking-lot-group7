import { randomUUID } from "node:crypto";
import { readRecords, writeRecords } from "../utils/recordsStorage.js";
import { doubleParking, lotFull } from "./parkingChecks.js";

export async function createParkingRecord(data) {
    const records = await readRecords();

    const isDoubleParked = doubleParking(records, data.licensePlate);

    if (isDoubleParked) {
        return {
            statusCode: 409,
            message: "Vehicle is already parked."
        };
    }

    const isLotFull = lotFull(records, data.lotNumber);

    if (isLotFull) {
        return {
            statusCode: 409,
            message: "Parking lot is already occupied."
        };
    }

    const now = new Date().toISOString();

    const newRecord = {
        id: randomUUID(),
        licensePlate: data.licensePlate,
        vehicleType: data.vehicleType,
        lotNumber: data.lotNumber,
        expectedTimeOut: data.expectedTimeOut,
        status: "parked",
        createdAt: now,
        updatedAt: now,
        actualTimeOut: null
    };

    records.push(newRecord);

    try {
        await writeRecords(records);
    } catch (error) {
        return {
            statusCode: 500,
            message: error.message
        };
    }

    return {
        statusCode: 201,
        message: "Parking record created successfully.",
        record: newRecord
    };
}