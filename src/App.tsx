import "./App.css";
import Header from "./components/Header";
import { Login, SignUp, PreviousGames, Game, Games } from "./pages";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProvider from "./components/UserProvider";
import Dropdown from "./components/Dropdown";
import GameLog from "./components/GameLog";
// import Game2 from "./components/Game2";

function App() {
  return (
    <UserProvider>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dropdown />} />
          <Route path="previous-games" element={<PreviousGames />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="newGame/:sessionId" element={<Game />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="games" element={<Games />} />
          <Route path="game-log/:sessionId" element={<GameLog />} />
        </Routes>
      </main>
    </UserProvider>
  );
}

export default App;
