import { BookingActionType } from "../constants";

export type BookingAction =
  | {
      type: BookingActionType.SELECT | BookingActionType.RESET;
      payload: number;
    }
  | {
      type: BookingActionType.INITIALISE;
      payload: number[];
    };
