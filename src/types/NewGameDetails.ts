export type NewGameDetails = {
  _id: string;
  boardSize: number;
  moves: [number];
  gameResult: string | null;
  position: number[];
};
