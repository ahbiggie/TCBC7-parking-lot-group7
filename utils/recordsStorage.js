import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recordsPath = path.join(__dirname, '../data', 'records.json');

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
        throw error;
    }
}

// console.log(await readRecords());

// write records function
async function writeRecords(data) {
    try {
        const writeRecord = JSON.stringify(data, null, "\t");

        await fs.writeFile(recordsPath, writeRecord, "utf-8");

        return true;
    } catch (error) {
        throw error;
    }
}

export { readRecords, writeRecords };