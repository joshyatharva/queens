import Confetti from "react-confetti";
import { RiVipCrown2Line } from "react-icons/ri";
import { useQueens } from "./hooks/useQueens";
import { useQueensCell } from "./hooks/useQueensCell";
import { cn } from "./utils";

const Cell = ({ i, j }: { i: number; j: number }) => {
  const { color, state, isError, onClick, onDoubleClick, solved, className } =
    useQueensCell({ i, j });

  return (
    <div
      className={cn(className, !solved && "cursor-pointer", "relative")} // Make the div a positioning context
      style={{ backgroundColor: color }}
      onClick={!solved ? onClick : undefined}
      onDoubleClick={!solved ? onDoubleClick : undefined}
    >
      {state === "queen" && (
        <RiVipCrown2Line
          size="45%"
          color={isError ? "red" : "black"}
          className={cn(isError && "shake", solved && "pulse")}
        />
      )}
    </div>
  );
};

export const Queens = () => {
  const { n, solved } = useQueens();

  return (
    <div className="flex flex-col items-center justify-center">
      {Array.from({ length: n }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-row items-center justify-center"
        >
          {Array.from({ length: n }).map((_, columnIndex) => (
            <Cell key={columnIndex} i={rowIndex} j={columnIndex} />
          ))}
        </div>
      ))}
      {solved && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          gravity={0.4}
          recycle={false}
        />
      )}
    </div>
  );
};
