import express from "express";
import parkingRecordsRouter from "./routes/parkingRecords.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/parking-records", parkingRecordsRouter);

app.listen(PORT, () => {
    console.log(`Parking-lot app is running on port: ${PORT}`);
});