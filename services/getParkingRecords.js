import { readRecords } from "../utils/recordsStorage.js";
import { getAvailableLots } from "./getAvailableLots.js";

export async function getParkingRecords(status) {
    try {
        const normalizedStatus = status ? status.toLowerCase() : undefined;

        if (normalizedStatus === "free") {
            return await getAvailableLots();
        }

        const records = await readRecords();

        if (!normalizedStatus) {
            return {
                statusCode: 200,
                message: "Parking records retrieved successfully.",
                records
            };
        }

        if (normalizedStatus === "parked" || normalizedStatus === "unparked") {
            const filteredRecords = records.filter((record) => {
                return record.status === normalizedStatus;
            });

            return {
                statusCode: 200,
                message: "Parking records retrieved successfully.",
                records: filteredRecords
            };
        }

        return {
            statusCode: 400,
            message: "Invalid status query. Use parked, unparked, or free."
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: "Could not retrieve parking records."
        };
    }
}