import { useCallback, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { get } from "../utils/http";
import style from "./Games.module.css";
import { Booking } from "../types/Booking";
import { API_HOST } from "../constants";
import { format } from "date-fns";

export default function Games() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = useCallback(async () => {
    try {
      const result = await get<Booking[]>(`${API_HOST}/api/newGame`);
      setBookings(result);
      console.log(result);
      console.log(
        result.map((item) => format(new Date(item.date), "dd-MM-yyyy"))
      );
      console.log(result.map((item) => item));
    } catch (error) {
      console.log((error as Error).message);
      logout();
      navigate("/");
    }
  }, [logout, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [fetchBookings, user]);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={style.container}>
      {bookings.map(({ _id, sessionId, date, gameResult }, index) => {
        const gameNumber = index + 1;
        return (
          <div className={style.list} key={_id}>
            <p className={style.title}>
              Game #{gameNumber} &nbsp;&nbsp;@
              {format(new Date(date), "dd-MM-yyyy")}
            </p>
            {gameResult === "Draw" ? (
              <p className={style.title}>Game is a {gameResult}</p>
            ) : (
              <p className={style.title}>Winner: {gameResult}</p>
            )}
            <button
              className={style.button}
              onClick={() => {
                navigate(`/game-log/${_id}`);
              }}
            >
              View game log
            </button>
          </div>
        );
      })}
    </div>
  );
}
