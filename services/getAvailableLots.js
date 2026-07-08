import { readRecords } from "../utils/recordsStorage.js";

const TOTAL_LOTS = 10;

export async function getAvailableLots() {
    try {
        const allLots = Array.from({ length: TOTAL_LOTS }, (_, index) => {
            return `A${index + 1}`;
        });

        const records = await readRecords();

        const occupiedLots = records
            .filter((record) => {
                return record.status === "parked";
            })
            .map((record) => {
                return record.lotNumber;
            });

        const availableLots = allLots.filter((lot) => {
            return !occupiedLots.includes(lot);
        });

        return {
            statusCode: 200,
            message: "Available lots retrieved successfully.",
            lots: availableLots
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: "Could not retrieve available lots."
        };
    }
}