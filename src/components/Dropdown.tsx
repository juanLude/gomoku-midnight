import { useContext, useEffect, useRef, useState } from "react";
import "./Dropdown.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { post } from "../utils/http";
import { API_HOST } from "../constants";
export default function Dropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const options = ["5", "6", "7", "8", "9", "10"];
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    setIsDropdownOpen(false);
  };

  const handleStartClick = async () => {
    if (user) {
      interface ApiResponse {
        sessionId: string;
        _id: string;
      }
      const selectedOptionNumber = Number(selectedOption);
      const moves = Array.from(
        { length: selectedOptionNumber * selectedOptionNumber },
        () => null
      );
      console.log("selectedOption: ", selectedOption);
      console.log(moves);
      const response: ApiResponse = await post(`${API_HOST}/api/newGame`, {
        boardSize: parseInt(selectedOption, 10),
        userId: user,
        result: "",
        moves: moves,
        position: [],
        gameResult: null,
      });

      const sessionId = response._id;

      navigate(`newGame/${sessionId}`);
    } else {
      navigate("login");
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown">
      <button onClick={toggleDropdown}>Board Size</button>
      {isDropdownOpen && (
        <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}

      {selectedOption && (
        <button className="start-button" onClick={handleStartClick}>
          Start
        </button>
      )}
    </div>
  );
}
