export function validateParkInput(data) {
  // Checking licensePlate
  if (!data.licensePlate) {
    return { valid: false, error: "licensePlate is required" };
  }

  if (typeof data.licensePlate !== "string") {
    return { valid: false, error: "licensePlate must be a string" };
  }

  if (data.licensePlate.trim() === "") {
    return { valid: false, error: "licensePlate cannot be empty" };
  }

  // Checking vehicleType
  if (!data.vehicleType) {
    return { valid: false, error: "vehicleType is required" };
  }

  if (typeof data.vehicleType !== "string") {
    return { valid: false, error: "vehicleType must be a string" };
  }

  if (data.vehicleType.trim() === "") {
    return { valid: false, error: "vehicleType cannot be empty" };
  }

  // Checking lotNumber
  if (data.lotNumber === undefined || data.lotNumber === null) {
    return { valid: false, error: "lotNumber is required" };
  }

  if (data.lotNumber === "") {
    return { valid: false, error: "lotNumber cannot be empty" };
  }

  // Checking expectedTimeOut
  if (!data.expectedTimeOut) {
    return { valid: false, error: "expectedTimeOut is required" };
  }

  if (typeof data.expectedTimeOut !== "string") {
    return { valid: false, error: "expectedTimeOut must be a string" };
  }

  if (data.expectedTimeOut.trim() === "") {
    return { valid: false, error: "expectedTimeOut cannot be empty" };
  }

  // If everything passes
  return { valid: true };
}
