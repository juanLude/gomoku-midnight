import { UserContext } from "../context";
import { useContext, useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backgroundMusic from "../assets/keithmitchell_soyousay.mp3";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const isBookingsPage = location.pathname === "/bookings";

  const { state } = location;
  const parsedGameDetails = state?.parsedGameDetails;
  const isGameLogPage = location.pathname.split("/")[1] === "game-log";
  const isGamePage = location.pathname.split("/")[1] === "newGame";
  const isGamesPage = location.pathname.split("/")[1] === "games";
  const toggleMusic = () => {
    setIsMusicOn((prevIsMusicOn) => !prevIsMusicOn);
  };

  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    if (isMusicOn) {
      audio.play();
    }
    return () => {
      audio.pause();
    };
  }, [isMusicOn]);
  const getActions = () => {
    if (user) {
      if (isGameLogPage || isGamePage || isGamesPage) {
        return null;
      }
      return (
        <>
          {!isBookingsPage && (
            <button
              className="login-button"
              onClick={() => {
                navigate("games", {
                  state: { parsedGameDetails },
                });
              }}
            >
              Previous Games
            </button>
          )}
          {!isBookingsPage && (
            <button
              className="login-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          )}
          <button className="login-button" onClick={toggleMusic}>
            {isMusicOn ? "🔊 Turn Music Off" : "🔈 Turn Music On"}
          </button>
        </>
      );
    } else {
      if (!isGameLogPage && !isGamePage) {
        return location.pathname !== "/login" ? (
          <button className="login-button" onClick={() => navigate("login")}>
            Login
          </button>
        ) : (
          <button className="login-button" onClick={() => navigate("sign-up")}>
            Sign Up
          </button>
        );
      }
    }
  };

  return (
    <>
      <header className="header">
        {/* unable Gomoku home page link if game on course */}
        <Link to={isGamePage ? "#" : "/"}>Gomoku</Link> {getActions()}
      </header>
    </>
  );
}
