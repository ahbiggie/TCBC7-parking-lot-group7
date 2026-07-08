import { readRecords } from "../utils/recordsStorage.js";

export async function getParkingRecordById(id) {
    try {
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

        return {
            statusCode: 200,
            message: "Parking record retrieved successfully.",
            record
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: "Could not retrieve parking record."
        };
    }
}