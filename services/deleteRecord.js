import { readRecords, writeRecords } from "../utils/recordsStorage.js";

export async function deactivateRecord(id) {
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

    record.status = "unparked";
    record.updatedAt = new Date().toISOString();

    try {
        await writeRecords(records);
    } catch (error) {
        return {
            statusCode: 500,
            message: "Could not deactivate parking record."
        };
    }

    return {
        statusCode: 200,
        message: "Parking record deactivated successfully.",
        record
    };
}