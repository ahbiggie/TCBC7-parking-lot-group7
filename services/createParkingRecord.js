import { readRecords } from "../utils/recordsStorage.js";

export async function doubleParking(licensePlate) {
    // 1. Reading from the ../data/recordsStorage.js file
    const records = await readRecords();

    // 2. Checking if the license plate is already parked
    const isAlreadyParked = records.some((record) => {
        return record.licensePlate === licensePlate && record.status === "parked";
    });

    // 3. Returning true if the license plate is already parked
    return isAlreadyParked;
}
