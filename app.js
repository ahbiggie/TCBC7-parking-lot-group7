import express from "express";
import parkingRecordsRouter from "./routes/parkingRecords.js";

const app = express();

app.use(express.json());

app.use("/parking-records", parkingRecordsRouter);