import express from "express";
import { readRecords } from "../utils/recordsStorage";

const router = express.Router();

//GET all parking records
router.get("/api/v1/parking-lot-records", async (req, res) => {
    try {
        const records = await readRecords();
        res.status(200).json({
            status : "success",
            results : records.length,
            data : records,
        });
    }
    catch(error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }

});

// GET one parking record
router.get("/api/v1/parking-lot-records/:lotId", async (req, res) => {
    try{
        const { lotId } = req.params;
        const records = await readRecords();
        const record = records.find(
            (record) => record.lotId === lotId
        );

        if (!record) {
            return res.status(404).json({
                status: "fail",
                message: "Parking record not found",
            });
        }
       res.status(200).json({
        status: "success",
        data: record,
       });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

export default router;