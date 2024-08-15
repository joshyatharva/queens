import { produce } from "immer";
import { createContext, ReactNode, useReducer } from "react";
import { getRandomColors, shuffleArray } from "../utils";

interface QueenContext {
  n: number;
  onClick: (i: number, j: number) => void;
  onDoubleClick: (i: number, j: number) => void;
  solved: boolean;
  resetGrid: () => void;
  changeGrid: (n: number) => void;
  getState: (i: number, j: number) => CellState;
  getColor: (i: number, j: number) => string;
  isError: (i: number, j: number) => boolean;
  isValid: (i: number, j: number) => boolean;
}

export const QueenContext = createContext<QueenContext>({} as QueenContext);

type Action =
  | { type: "single-click"; payload: { i: number; j: number } }
  | { type: "double-click"; payload: { i: number; j: number } }
  | { type: "reset"; payload?: undefined }
  | { type: "change-grid"; payload: { n: number } };

type CellState = "queen" | "nothing" | "cross";

type Grid = {
  state: CellState;
  isError?: boolean;
  color: string;
}[][];

const generateGrid = (n: number): Grid => {
  const matrix = getColorMatrix(n);
  return matrix.map((row) =>
    row.map((column) => ({ state: "nothing", color: column }))
  );
};

const getSolution = (n: number): number[] => {
  const inner = (
    array: number[],
    currentElement?: number
  ): number[] | undefined => {
    if (array.length === 0) return [];
    const filtered =
      currentElement !== undefined
        ? array.filter((item) => Math.abs(item - currentElement) > 1)
        : array;
    for (const currentElement of filtered) {
      const solution = inner(
        array.filter((item) => item !== currentElement),
        currentElement
      );
      if (solution) return [currentElement, ...solution];
    }
    return;
  };
  return (
    inner(shuffleArray(Array.from({ length: n }, (_, index) => index))) || []
  );
};

const getColorMatrix = (n: number) => {
  const solution = getSolution(n);
  console.log({ solution });
  const colors = getRandomColors(n);
  const matrix: string[][] = Array.from({ length: n }, () => Array(n).fill(""));
  let radar = solution.map((columnIndex, rowIndex) => [rowIndex, columnIndex]);

  const isValidAndTouched = (i: number, j: number) =>
    i >= 0 && i < n && j >= 0 && j < n && matrix[i][j];

  const isValidAndUntouched = (i: number, j: number) =>
    i >= 0 && i < n && j >= 0 && j < n && matrix[i][j] === "";

  const addValidNeighboursToRadar = (rowIndex: number, columnIndex: number) => {
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const newRowIndex = rowIndex + i;
        const newColumnIndex = columnIndex + j;
        if (
          Math.abs(i - j) == 1 &&
          isValidAndUntouched(newRowIndex, newColumnIndex) &&
          !radar.find(([r, c]) => r === newRowIndex && c === newColumnIndex)
        )
          radar.push([newRowIndex, newColumnIndex]);
      }
    }
  };

  const pickNeighbor = (rowIndex: number, columnIndex: number) => {
    const x = shuffleArray([-1, 0, 1]);
    const y = shuffleArray([-1, 0, 1]);
    for (const i of x) {
      for (const j of y)
        if (
          Math.abs(i - j) == 1 &&
          isValidAndTouched(rowIndex + i, columnIndex + j)
        )
          return matrix[rowIndex + i][columnIndex + j];
    }
    return matrix[rowIndex][columnIndex];
  };

  while (radar.length) {
    shuffleArray(radar);
    const [rowIndex, columnIndex] =
      radar[radar.length === 1 ? 0 : Math.floor(Math.random() * radar.length)];
    if (solution[rowIndex] === columnIndex)
      matrix[rowIndex][columnIndex] = colors[columnIndex];
    else matrix[rowIndex][columnIndex] = pickNeighbor(rowIndex, columnIndex);
    addValidNeighboursToRadar(rowIndex, columnIndex);
    radar = radar.filter(([r, c]) => r !== rowIndex || c !== columnIndex);
  }

  return matrix;
};

type State = { solved: boolean; grid: Grid };
const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  const n = state.grid.length;

  const isValid = (i: number, j: number) => i >= 0 && j >= 0 && i < n && j < n;

  return produce(state, (draft) => {
    switch (type) {
      case "single-click":
      case "double-click": {
        const { i, j } = payload;
        if (!isValid) return draft;
        const { state: currentState } = draft.grid[i][j];
        draft.grid[i][j].state =
          currentState === "nothing" ? "queen" : "nothing";
        break;
      }
      case "reset":
        for (let i = 0; i < draft.grid.length; i += 1)
          for (let j = 0; j < draft.grid.length; j += 1) {
            draft.grid[i][j] = {
              ...draft.grid[i][j],
              state: "nothing",
              isError: false,
            };
          }
        break;

      case "change-grid":
        return { solved: false, grid: generateGrid(n) };

      default:
        return;
    }

    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        const color = draft.grid[i][j].color;
        const state = draft.grid[i][j].state;
        if (state !== "queen") continue;
        draft.grid[i][j].isError = false;
        for (let p = 0; p < n; p += 1) {
          if (draft.grid[i][j].isError) break;
          for (let q = 0; q < n; q += 1) {
            if (draft.grid[i][j].isError) break;
            const otherColor = draft.grid[p][q].color;
            const otherState = draft.grid[p][q].state;
            if (p === i && q === j) continue;
            if (p !== i && q !== j && otherColor !== color) continue;
            if (otherState === "queen") draft.grid[i][j].isError = true;
          }
        }
        if (
          [
            [-1, -1],
            [1, 1],
            [-1, 1],
            [1, -1],
          ].some(
            ([xOffset, yOffset]) =>
              isValid(i + xOffset, j + yOffset) &&
              draft.grid[i + xOffset][j + yOffset].state === "queen"
          )
        )
          draft.grid[i][j].isError = true;
      }
    }
    const solved = draft.grid.every(
      (row) =>
        row.every((item) => !item.isError) &&
        row.some((item) => item.state === "queen")
    );
    draft.solved = solved;
  });
};

export const QueenProvider = ({ children }: { children: ReactNode }) => {
  const [{ solved, grid }, dispatch] = useReducer(reducer, {
    solved: false,
    grid: generateGrid(25),
  });

  return (
    <QueenContext.Provider
      value={{
        n: grid.length,
        onClick: (i: number, j: number) =>
          dispatch({ type: "single-click", payload: { i, j } }),
        onDoubleClick: (i: number, j: number) =>
          dispatch({ type: "double-click", payload: { i, j } }),
        changeGrid: (n: number) =>
          dispatch({ type: "change-grid", payload: { n } }),
        resetGrid: () => dispatch({ type: "reset" }),
        getState: (i: number, j: number) => grid[i][j].state,
        getColor: (i: number, j: number) => grid[i][j].color,
        isError: (i: number, j: number) => grid[i][j].isError || false,
        isValid: (i: number, j: number) =>
          i >= 0 && i < grid.length && j >= 0 && j < grid.length,
        solved,
      }}
    >
      {children}
    </QueenContext.Provider>
  );
};
