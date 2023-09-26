import style from "./GameLog.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useEffect, useState, useContext, useCallback, useMemo } from "react";

import { get } from "../utils/http";
import { SessionDetails } from "../types/SessionDetails";
import { API_HOST } from "../constants";
import { UserContext } from "../context";

const getWebSocketURL = () => {
  if (!API_HOST) return "ws://localhost:8080";
  const hostURL = new URL(API_HOST);
  return `${hostURL.protocol === "https:" ? `wss` : `ws`}://${
    hostURL.hostname
  }`;
};

export default function GameLog() {
  const { user, logout } = useContext(UserContext);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>();
  const [occupiedSeats, setOccupiedSeats] = useState<(string | null)[]>([]);
  const ws = useMemo(() => new WebSocket(getWebSocketURL()), []);

  const { sessionId } = useParams();
  const navigate = useNavigate();

  const fetchSessionDetails = useCallback(async () => {
    try {
      const result = await get<SessionDetails>(
        `${API_HOST}/api/newGame/${sessionId}`
      );

      setSessionDetails(result);
      setOccupiedSeats(result.moves);
    } catch (error) {
      console.log((error as Error).message);
    }
  }, [logout, navigate, sessionId]);

  useEffect(() => {
    if (!user) return;
    fetchSessionDetails().then(() => {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            typeof data === "object" &&
            data.undatedBy !== user._id &&
            "occupiedSeats" in data
          ) {
            setOccupiedSeats(data.occupiedSeats);
          }
        } catch (e) {
          console.log(e);
        }
      };
    });
  }, [fetchSessionDetails, user, ws]);

  if (!user) return <Navigate to="/login" replace />;
  if (!sessionDetails) return null;

  // Define the size of the board
  const boardSize = sessionDetails.boardSize;

  // Create an empty board with null values
  const emptyBoard = Array(boardSize * boardSize).fill(null);

  // Initialise the board with stones from the moves array and assign sequence numbers
  const boardWithMoves = emptyBoard.map((_, index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const cellIndex = row * boardSize + col;
    const move = occupiedSeats[cellIndex];
    if (move === "Black" || move === "White") {
      const moveNumber = sessionDetails.position.indexOf(cellIndex);
      return {
        stone: move,
        moveNumber: moveNumber + 1,
      };
    } else {
      return null;
    }
  });

  return (
    <div>
      <p>Winner: {sessionDetails.gameResult}</p>
      <div className={style.container}>
        <div
          className={style.seats}
          style={{
            gridTemplateColumns: `repeat(${sessionDetails.boardSize}, 1fr)`,
          }}
        >
          {boardWithMoves.map((cell, index) => (
            <div key={index} className={style.cell}>
              {cell && (
                <div
                  className={
                    cell.stone === "Black" ? style.blackStone : style.whiteStone
                  }
                >
                  {cell.moveNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={style.buttonContainer}>
        <button className={style.button} onClick={() => navigate("/games")}>
          Back
        </button>
      </div>
    </div>
  );
}
