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
router.put('/:lotId', async (req, res) => {
    try {
        // Get lot ID from url & vehicle details from request body
        const { lotId } = req.params;
        const { licensePlate, vehicleType } = req.body;

        if (!licensePlate || !vehicleType) {
            return res.status(400).json({
                error: "license and vehicleType are required to park a vehicle."
            });
        }

        const parkingLots = await readData();

        // Find the specific parking slot in JSON file
        const lot = parkingLots.find(item => item.lotId === lotId);

        // If slot deosn't exist...
        if (!lot) {
            return res.status(404).json({
                error: `Parking slot with ID ${lotId} does not exist.`
            });
        }

        // If slot is already occupied...
        if (lot.status === 'parked') {
            return res.status(409).json({
                error: `Parking slot ${lotId} is already occupied by a vehicle with license plate ${lot.licensePlate}.`
            });
        }

        // Update parking slot details with newly parked vehicle info
        lot.licensePlate = licensePlate;
        lot.vehicleType = vehicleType;
        lot.status = 'parked';

        const now = new Date().toISOString();
        lot.updatedAt = now;
        lot.parkedAt = now;
        lot.unparkedAt = null;

        await writeData(parkingLots);
        return res.status(200).json({
            message: "Vehicle parked successfully.",
            data: lot
        });

        // send test response to see if server receives the data
        res.json({
            message: `Attempting to park in slot ${lotId}`,
            data: {
                licensePlate,
                vehicleType,
            },
        });
    } catch (error) {
        console.error("Error while handling PUT /:ilotId :", error);
        return res.status(500).json({
            error: "Unexpected internal server error occurred."
        });
    }
});

// PUT endpoint to unpark a vehicle (release the slot)
router.put('/:lotId/unpark', async (req, res) => {
    try{
        const { lotId } = req.params;

        const parkingLots = await readData();

        // Find the specific parking slot
        const lot = parkingLots.find(item => item.lotId === lotId);

        // If slot doesn't exist...
        if (!lot) {
            return res.status(404).json({
                error: `Parking slot with ID ${lotId} does not exist.`
            });
        }

        // If slot is already empty...
        if (lot.status === 'available') {
            return res.status(400).json({
                error: `Cannot unpark. Parking slot ${lotId} is already empty.`
            });
        }

        // Update parking slot details
        lot.licensePlate = null;
        lot.vehicleType = null;
        lot.status = 'available';

        const now = new Date().toISOString();
        lot.updatedAt = now;
        lot.unparkedAt = now;

        await writeData(parkingLots);  // save updated data

        return res.status(200).json({
            message: "Vehicle unparked successfully.",
            data: lot
        });
    } catch (error) {
        console.error("Error handling PUT /:lotId/unpark: ", error);
        return res.status(500).json({
            error: "An unexpected internal server error occured."
        });
    }
});

export default router;
