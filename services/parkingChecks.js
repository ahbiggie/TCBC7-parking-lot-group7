export function doubleParking(records, licensePlate) {
    return records.some((record) => {
        return record.licensePlate === licensePlate && record.status === "parked";
    });
}

export function lotFull(records, lotNumber) {
    return records.some((record) => {
        return record.lotNumber === lotNumber && record.status === "parked";
    });
}

export function lotOccupiedByAnother(records, lotNumber, currentRecordId) {
    return records.some((record) => {
        return (
            record.lotNumber === lotNumber &&
            record.status === "parked" &&
            record.id !== currentRecordId
        );
    });
}