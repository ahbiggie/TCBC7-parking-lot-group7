import express from "express";

import { createParkingRecord } from "../services/createParkingRecord.js";
import { getParkingRecords } from "../services/getParkingRecords.js";
import { getParkingRecordById } from "../services/getParkingRecordById.js";
import { updateParkingRecord } from "../services/updateParkingRecord.js";
import { deactivateRecord } from "../services/deleteRecord.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const result = await createParkingRecord(req.body);

        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error."
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await getParkingRecords(req.query.status);

        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await getParkingRecordById(req.params.id);

        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error."
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const result = await updateParkingRecord(req.params.id, req.body);

        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error."
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await deactivateRecord(req.params.id);

        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error."
        });
    }
});

export default router;