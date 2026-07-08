import express from 'express';
import fs from 'fs/promises';
import path from 'path';


const router = express.Router();

// Absolute path to data.json file
const dataPath = path.resolve('data/data.json');

// Function to read & parse JSON file
async function readData() {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
}

// Function to stringify and write data back to the JSONO file
async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// PUT endpoint to park a vehicle in a specific slot
router.put('/:lotId', (req, res) => {
    // Get lot ID from url & vehicle details from request body
    const { lotId } = req.params;
    const { licensePlate, vehicleType } = req.body;

    console.log(lotId, licensePlate, vehicleType);

    // send test response to see if server receives the data
    res.json({
        message: `Attempting to park in slot ${lotId}`,
        data: {
            licensePlate,
            vehicleType,
        },
    });
});

export default router;
