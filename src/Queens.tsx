import Confetti from "react-confetti";
import { RiCloseLine, RiVipCrown2Line } from "react-icons/ri";
import { useQueens } from "./hooks/useQueens";
import { useQueensCell } from "./hooks/useQueensCell";
import { cn } from "./utils";
import { Box } from "@mui/material";

const Cell = ({ i, j }: { i: number; j: number }) => {
  const { color, state, isError, onClick, onDoubleClick, solved, className } =
    useQueensCell({ i, j });

  return (
    <Box
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
      {state === "cross" && (
        <RiCloseLine size="20%" className="text-black/75" />
      )}
    </Box>
  );
};

export const Queens = () => {
  const { n, solved } = useQueens();
  console.log({ n });
  return (
    <Box id="temp" className="w-full flex flex-col items-center justify-center">
      {Array.from({ length: n }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {Array.from({ length: n }).map((_, columnIndex) => (
            <Cell key={columnIndex} i={rowIndex} j={columnIndex} />
          ))}
        </Box>
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
    </Box>
  );
};
