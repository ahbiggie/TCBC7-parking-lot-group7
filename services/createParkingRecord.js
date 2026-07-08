export async function doubleParking(records, licensePlate) {
    // 1. Checking if the license plate is already parked
    const isAlreadyParked = records.some((record) => {
        return record.licensePlate === licensePlate && record.status === "parked";
    });

    // 2. Returning true if the license plate is already parked
    return isAlreadyParked;
}

export async function lotFull(records, lotNumber) {
    const isLotOccupied = records.some((record) => {
        return record.lotNumber === lotNumber && record.status === "parked";
    });

    return isLotOccupied;
}