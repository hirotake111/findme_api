import { Position } from "../types";

/**
 * validate data and return position object, otherwise throw an error
 */
export const validatePosition = (payload: any): Position => {
  const { latitude, longitude, code } = payload;
  // validate latitude
  if (!(latitude && typeof latitude === "number"))
    throw new Error(`invalid value in latitude: ${latitude}`);
  // validate longitude
  if (!(longitude && typeof longitude === "number"))
    throw new Error(`invalid value in longitude: ${longitude}`);
  if (code && typeof code !== "string")
    throw new Error(`invalid value in code: ${code}`);

  return { latitude, longitude, code };
};
