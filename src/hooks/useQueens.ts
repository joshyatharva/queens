import { useContext } from "react";
import { QueenContext } from "../context/queen";

export const useQueens = () => {
  const { n, solved } = useContext(QueenContext);
  return { n, solved };
};
