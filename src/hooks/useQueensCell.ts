import { useContext } from "react";
import { QueenContext } from "../context/queen";
import { cn } from "../utils";

interface UseQueensCellProps {
  i: number;
  j: number;
}

const neighborOffset = [
  { type: "left", x: 0, y: -1 },
  { type: "top", x: -1, y: 0 },
];

export const useQueensCell = ({ i, j }: UseQueensCellProps) => {
  const {
    n,
    onClick,
    onDoubleClick,
    getState,
    getColor,
    isError,
    isValid,
    solved,
  } = useContext(QueenContext);

  const differentNeighbor = neighborOffset
    .filter(
      ({ x, y }) =>
        !isValid(i + x, j + y) || getColor(i + x, j + y) !== getColor(i, j)
    )
    .map(({ type }) => type);

  return {
    n,
    state: getState(i, j),
    color: getColor(i, j),
    isError: isError(i, j),
    solved,
    onClick: () => onClick(i, j),
    onDoubleClick: () => onDoubleClick(i, j),
    className: cn(
      "flex border-l-2 border-t-2 border-solid border-collapse items-center justify-center border-black",
      i === 0 && j === 0 && "rounded-tl-md",
      i === 0 && j === n - 1 && "rounded-tr-md",
      i === n - 1 && j === 0 && "rounded-bl-md",
      i === n - 1 && j === n - 1 && "rounded-br-md",
      j === n - 1 && "border-r-4",
      i === n - 1 && "border-b-4",
      differentNeighbor.includes("left") && "border-l-4",
      differentNeighbor.includes("top") && "border-t-4",
      n <= 25 && "size-[2rem]",
      n <= 23 && "size-[2.3rem]",
      n <= 20 && "size-[2.5rem]",
      n <= 17 && "size-[3rem]",
      n <= 15 && "size-[3.5rem]",
      n <= 12 && "size-[4.5rem]",
      n <= 7 && "size-24"
    ),
  };
};
