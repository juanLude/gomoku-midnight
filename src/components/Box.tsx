import { useEffect, useState } from "react";
import style from "./Box.module.css";
import { BOX_STATUS } from "../constants";
import { BookingAction } from "../types/BookingAction";
import { Booking } from "../types/Booking";

type BoxProps = {
  id: number;
  handleMove: (index: number) => void;
  currentPlayer: string;
  disabled: boolean;
  restart: boolean;
  onSelect: () => void;
  value: string | null;
  //added on 13/09
  // isSelected?: boolean;
  // isOccupied?: boolean;
  // dispatch: React.Dispatch<BookingAction>;
};

export default function Box(props: BoxProps) {
  const {
    id,
    handleMove,
    currentPlayer,
    disabled,
    restart,
    onSelect,
    // isSelected = false,
    // isOccupied = false,
    // dispatch,
  } = props;

  const [status, setStatus] = useState(BOX_STATUS.AVAILABLE);
  const [stone, setStone] = useState<"Black" | "White" | null>(null); // Track black or white stone

  // Reset stone and status when the restart prop changes
  useEffect(() => {
    if (restart) {
      setStatus(BOX_STATUS.AVAILABLE);
      setStone(null);
    }
  }, [restart]);

  const getClassNames = (): string => {
    const classNames = [style.box];
    if (restart) {
      classNames.push(style.available);
    }

    if (disabled) {
      classNames.push(style.occupied);
    } else {
      switch (status) {
        case BOX_STATUS.AVAILABLE:
          classNames.push(style.available);
          break;
        case BOX_STATUS.OCCUPIED:
          classNames.push(style.occupied);
          break;
        default:
          break;
      }
    }

    return classNames.join(" ");
  };

  const handleClick = () => {
    if (!disabled && status === BOX_STATUS.AVAILABLE && stone === null) {
      handleMove(id);
      setStatus(BOX_STATUS.OCCUPIED);
      setStone(currentPlayer === "Black" ? "Black" : "White");
      onSelect();
    }
  };

  return (
    <div className={getClassNames()} onClick={handleClick}>
      {stone && (
        <div
          className={stone === "Black" ? style.blackStone : style.whiteStone}
        />
      )}
    </div>
  );
}
