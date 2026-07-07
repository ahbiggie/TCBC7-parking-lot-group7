// this is a placeholder for /parking-records utils
// parking-records helper functions are here.

import fs from 'fs/promises';
const filePath = './data/data.json';

export async function readData() {
    try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            //'ENOENT' means 'Error NO ENTry' or 'no such file or directory'.
            return []; // File does not exist ?? return an empty array
        }   throw new Error(`Failed to read data: ${error.message}`);
    }
}

export async function writeData(data) {
    try{
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing data:', error);
        throw new Error(`Failed to write data: ${error.message}`);
    }
}