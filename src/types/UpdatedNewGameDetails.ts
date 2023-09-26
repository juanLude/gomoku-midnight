export type UpdatedNewGameDetails = {
  _id: string;
  userId: string | null;
  boardSize: number | null;
  position: number[];
  moves: (string | null)[];
  gameResult: string | null;
};
