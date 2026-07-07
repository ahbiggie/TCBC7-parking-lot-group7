// this is a placeholder for /parking-records utils
// parking-records helper functions are here.

import fs from 'fs/promises';
const filePath = './data/data.json';

export async function readData() {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function writeData(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}