import fs from "fs";
import express from "express";
const app = express();
app.use(express.json());

const PORT = 3000;

const parkingLotRecords = JSON.parse(
  fs.readFileSync("./data/parking-lot/parking-lot-record.json"),
);

app.get("/api/v1/parking-lot-records", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      parkingLotRecords: parkingLotRecords,
    },
  });
});

app.get("/api/v1/parking-lot-records/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id > parkingLotRecords.length) {
    return res.status(404).json({
      status: "Fail",
      message: "ID is invalid",
    });
  }
  const ParkingLotRecord = parkingLotRecords.find((e) => e.id === id);
  res.status(200).json({
    status: "success",
    data: {
      parkingLotRecord: parkingLotRecord,
    },
  });
});

app.post("/api/v1/parking-lot-records", (req, res) => {
  const newId = parkingLotRecords[parkingLotRecords.length - 1].id + 1;
  const newParkingLotRecord = Object.assign({ id: newId }, req.body);
  (parkingLotRecords.push(newParkingLotRecord),
    fs.writeFile(
      "./data/parking-lot/parking-lot-record.json",
      JSON.stringify(parkingLotRecords),
      (err) => {
        res.status(201).json({
          status: "success",
          data: {
            parkingLotRecord: newParkingLotRecord,
          },
        });
      },
    ));
});

app.patch("/api/v1/parking-lot-records/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const parkingLotRecord = parkingLotRecords.find((e) => e.id === id);

  if (!parkingLotRecord) {
    return res.status(404).json({
      status: "Fail",
      message: "Parking lot record not found",
    });
  }
  const index = parkingLotRecords.findIndex((i) => i.id === id);
  const updatedParkingLotRecord = {
    ...parkingLotRecords[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  parkingLotRecords[index] = updatedParkingLotRecord;

  fs.writeFileSync(
    "./data/parking-lot/parking-lot-record.json",
    JSON.stringify(parkingLotRecords),
  );

  res.status(200).json({
    status: "success",
    data: {
      parkingLotRecord: updatedParkingLotRecord,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Parking-lot app is running on port: ${PORT}`);
});
