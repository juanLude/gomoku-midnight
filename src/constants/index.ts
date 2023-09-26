export enum BOX_STATUS {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
}

export enum BookingActionType {
  SELECT = "SELECT",
  RESET = "RESET",
  INITIALISE = "INITIALISE",
}

export const API_HOST = process.env.REACT_APP_API_HOST || "";
