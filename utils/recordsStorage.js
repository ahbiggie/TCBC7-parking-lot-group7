import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recordsPath = path.join(__dirname, '../data', 'data.json');

async function readRecords() {
    try {
        //1. read all records from records.json
        const records = await fs.readFile(recordsPath, 'utf-8');
        //2. convert records to js arrays
        const recordsToArray = JSON.parse(records);
        // 3. return the array
        return recordsToArray;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        //Throw any type of error, handled in the service folder
        throw error;
    }
}


// write records function
async function writeRecords(data) {
    try {
        const writeRecord = JSON.stringify(data, null, "\t");

        await fs.writeFile(recordsPath, writeRecord, "utf-8");

        return true;
    } catch (error) {
        // Throw any type of error, handled in the service folder
        throw error;
    }
}

// Validiation Logic

export function validateParkInput(data) {
    // Checking licensePlate
    if (!data.licensePlate) {
        return { valid: false, error: "licensePlate is required" };
    }

    if (typeof data.licensePlate !== "string") {
        return { valid: false, error: "licensePlate must be a string" };
    }

    if (data.licensePlate.trim() === "") {
        return { valid: false, error: "licensePlate cannot be empty" };
    }

    // Checking vehicleType
    if (!data.vehicleType) {
        return { valid: false, error: "vehicleType is required" };
    }

    if (typeof data.vehicleType !== "string") {
        return { valid: false, error: "vehicleType must be a string" };
    }

    if (data.vehicleType.trim() === "") {
        return { valid: false, error: "vehicleType cannot be empty" };
    }

    // Checking lotNumber
    if (data.lotNumber === undefined || data.lotNumber === null) {
        return { valid: false, error: "lotNumber is required" };
    }

    if (data.lotNumber === "") {
        return { valid: false, error: "lotNumber cannot be empty" };
    }

    // Checking expectedTimeOut
    if (!data.expectedTimeOut) {
        return { valid: false, error: "expectedTimeOut is required" };
    }

    if (typeof data.expectedTimeOut !== "string") {
        return { valid: false, error: "expectedTimeOut must be a string" };
    }

    if (data.expectedTimeOut.trim() === "") {
        return { valid: false, error: "expectedTimeOut cannot be empty" };
    }

    // If everything passes
    return { valid: true };
}


export { readRecords, writeRecords };