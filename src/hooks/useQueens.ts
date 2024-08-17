import { useContext } from "react";
import { QueenContext } from "../context/QueenProvider";

export const useQueens = () => {
  const { n, solved } = useContext(QueenContext);
  return { n, solved };
};
