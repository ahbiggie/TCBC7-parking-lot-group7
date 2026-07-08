import { readRecords, writeRecords } from "../utils/recordsStorage.js";
import { lotOccupiedByAnother } from "./parkingChecks.js";

export async function updateParkingRecord(id, data) {
    const records = await readRecords();

    const record = records.find((record) => {
        return record.id === id;
    });

    if (!record) {
        return {
            statusCode: 404,
            message: "Parking record not found."
        };
    }

    if (Object.hasOwn(data, "status")) {
        if (data.status !== "parked" && data.status !== "unparked") {
            return {
                statusCode: 400,
                message: "Status must be either parked or unparked."
            };
        }

        if (data.status === "unparked" && record.status !== "parked") {
            return {
                statusCode: 409,
                message: "Vehicle is not currently parked."
            };
        }
    }

    if (Object.hasOwn(data, "lotNumber")) {
        const lotIsOccupied = lotOccupiedByAnother(records, data.lotNumber, id);

        if (lotIsOccupied) {
            return {
                statusCode: 409,
                message: "Parking lot is already occupied."
            };
        }
    }

    const updates = {};

    if (Object.hasOwn(data, "status")) {
        updates.status = data.status;
    }

    if (Object.hasOwn(data, "lotNumber")) {
        updates.lotNumber = data.lotNumber;
    }

    if (Object.hasOwn(data, "actualTimeOut")) {
        updates.actualTimeOut = data.actualTimeOut;
    }

    updates.updatedAt = new Date().toISOString();

    Object.assign(record, updates);

    try {
        await writeRecords(records);
    } catch (error) {
        return {
            statusCode: 500,
            message: "Could not update parking record."
        };
    }

    return {
        statusCode: 200,
        message: "Parking record updated successfully.",
        record
    };
}