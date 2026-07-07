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
            //'ENOENT' means 'Error NO ENTry' or 'no such file or directory', which means the file does not exist
            return []; // File does not exist, return an empty array
        }   throw error;
    }
}

export async function writeData(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}