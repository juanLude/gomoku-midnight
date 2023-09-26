import { UserContext } from "../context";
import {
  useContext,
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Box from "./Box";
import style from "./Game.module.css";
import { API_HOST, BookingActionType } from "../constants";
import clickSound from "../assets/click_sound.mp3";
import { get, put, del } from "../utils/http";
import { NewGameDetails } from "../types/NewGameDetails";
import { BookingAction } from "../types/BookingAction";

import { UpdatedNewGameDetails } from "../types/UpdatedNewGameDetails";

function bookingReducer(state: number[], action: BookingAction) {
  const { type, payload } = action;
  switch (type) {
    case BookingActionType.INITIALISE:
      return payload;
    case BookingActionType.SELECT:
      return [...state, payload];
    case BookingActionType.RESET:
      return [];
    default:
      return state;
  }
}
export default function Game() {
  const { user, logout } = useContext(UserContext);
  const { sessionId = "" } = useParams();

  const navigate = useNavigate();

  const [sessionDetails, setSessionDetails] = useState<NewGameDetails>();
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [restart, setRestart] = useState<boolean>(false);
  const [moves, setMoves] = useState<(string | null)[]>([]);
  const [position, setPosition] = useState<number[]>([]);

  const [board, setBoard] = useState<Array<string | null>>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("Black");
  const [state, dispatch] = useReducer(bookingReducer, []);

  const fetchSessionDetails = useCallback(async () => {
    try {
      const result = await get<NewGameDetails>(
        `${API_HOST}/api/newGame/${sessionId}`
      );
      setSessionDetails(result);
      dispatch({
        type: BookingActionType.INITIALISE,
        payload: result.moves,
      });
    } catch (error) {
      console.log((error as Error).message);
      logout();
      navigate("/");
    }
  }, [logout, navigate, sessionId]);

  useEffect(() => {
    if (!user) return;
    fetchSessionDetails();
  }, [fetchSessionDetails, user]);

  useEffect(() => {
    if (sessionDetails && sessionDetails.boardSize) {
      // Create an empty board with the correct size
      const initialBoard = Array(
        sessionDetails.boardSize * sessionDetails.boardSize
      ).fill(null);
      setBoard(initialBoard);
    }
  }, [sessionDetails]);

  const play = () => {
    new Audio(clickSound).play();
  };
  console.log("sessionId: ", sessionId);
  interface ServerResponse {
    board: (string | null)[];
    moves: (string | null)[];
    gameResult: string | null;
    updatedNewGame: UpdatedNewGame;
  }
  interface UpdatedNewGame {
    _id: string;
    userId: string;
    gameResult: string | null;
    gameOver: boolean;
    boardSize: number;
    position: [number];
    moves: (string | null)[];
    date: string;
    __v: number;
  }

  // Function to handle a player move
  const handleMove = async (index: number) => {
    console.log("Index: ", index);
    if (!gameOver && board[index] === null) {
      console.log("board", board);
      const newBoard = [...board];
      newBoard[index] = currentPlayer;

      // Initialise position as an empty array if undefined
      const updatedPosition = position ? [...position, index] : [index];
      setPosition(updatedPosition);

      // Update the moves array with the new move
      const newMoves = [...moves];

      newMoves.push(currentPlayer);

      // Send the move to the server
      try {
        const response = await put<UpdatedNewGameDetails, ServerResponse>(
          `${API_HOST}/api/newGame/${sessionId}`,
          {
            _id: sessionId,
            userId: "",
            boardSize: Math.sqrt(board.length),
            gameResult: null,
            position: updatedPosition,
            moves: newBoard,
          }
        );

        setBoard(newBoard);
        setMoves(newMoves);
        setMoves(response?.moves);
        setGameOver(response?.updatedNewGame?.gameOver);
        setWinner(response?.updatedNewGame?.gameResult);
        togglePlayerTurn();
        play();
      } catch (error) {
        console.error("Error making a move:", error);
      }
    }
  };

  const togglePlayerTurn = () => {
    setCurrentPlayer(currentPlayer === "Black" ? "White" : "Black");
  };

  // Restart the game
  const restartGame = async () => {
    console.log("array restarted: " + board);
    try {
      setBoard(Array(board.length).fill(null));
      setPosition([]);
      setWinner(null);
      setCurrentPlayer("Black");
      setGameOver(false);
      setRestart(!restart);
      setMoves([]);
      dispatch({
        type: BookingActionType.RESET,
        payload: 0,
      });
      await put(`${API_HOST}/api/newGame/${sessionId}`, {
        reset: true,
        moves: Array(Math.sqrt(board.length)).fill(null),
        _id: sessionId,
        userId: "",
        boardSize: Math.sqrt(board.length),
        gameResult: null,
        position: position,
      });
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  };

  // Leave the game
  const leaveGame = async () => {
    const result = await get<NewGameDetails>(`${API_HOST}/api/newGame`);
    setSessionDetails(result);
    console.log(result.gameResult);
    console.log("gameOver: " + result.gameResult);
    if (result.gameResult !== null) {
      navigate("/games");
    } else {
      await del(`${API_HOST}/api/newGame/${sessionId}`);
      navigate("/");
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={style.container}>
      {winner !== null && winner !== undefined && (
        <p>{winner === "Draw" ? "It is a draw!" : `Winner is: ${winner}`}</p>
      )}
      {winner == null && <p>Current player: {currentPlayer}</p>}
      <div
        ref={boardRef}
        className={style.seats}
        style={{
          gridTemplateColumns: `repeat(${sessionDetails?.boardSize}, 1fr)`,
        }}
      >
        {board.map((cell, index) => (
          <Box
            key={`box-${index}-${restart}`}
            id={index}
            value={cell}
            handleMove={handleMove}
            currentPlayer={currentPlayer}
            disabled={winner !== null && winner !== undefined}
            restart={restart}
            onSelect={() =>
              dispatch({ type: BookingActionType.SELECT, payload: index })
            }
          />
        ))}
      </div>
      <div className={style.buttonContainer}>
        <button className={style.button} onClick={restartGame}>
          Restart
        </button>
        <button className={style.button} onClick={leaveGame}>
          Leave
        </button>
      </div>
    </div>
  );
}
