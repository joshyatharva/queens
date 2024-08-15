import { twMerge } from "tailwind-merge";

export const cn = twMerge;

export const getRandomColor = (type: "any" | "light" | "dark" = "any") => {
  const getRandomValue = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  let r, g, b;
  if (type === "dark") {
    r = getRandomValue(0, 127);
    g = getRandomValue(0, 127);
    b = getRandomValue(0, 127);
  } else if (type === "light") {
    r = getRandomValue(128, 255);
    g = getRandomValue(128, 255);
    b = getRandomValue(128, 255);
  } else {
    r = getRandomValue(0, 255);
    g = getRandomValue(0, 255);
    b = getRandomValue(0, 255);
  }

  const toHex = (value: number) =>
    value.toString(16).padStart(2, "0").toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const n = array.length;
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const isColorDark = (color: string) => {
  // Remove the hash at the start if it's there
  color = color.replace(/^#/, "");

  // Parse the color into its RGB components
  let r, g, b;
  if (color.length === 3) {
    // For shorthand hex codes like #abc
    r = parseInt(color[0] + color[0], 16);
    g = parseInt(color[1] + color[1], 16);
    b = parseInt(color[2] + color[2], 16);
  } else if (color.length === 6) {
    // For full hex codes like #aabbcc
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
  } else {
    throw new Error("Invalid hex color");
  }

  // Calculate the relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return whether the color is dark or light
  return luminance < 128;
};

export const getRandomColors = (n: number) => {
  // console.log("type", type, "n", n);
  return LINKED_THEME.slice(0, n);
  // return shuffleArray([...ROYAL_DARK_COLORS]).slice(0, n);
  // console.log(randomColors);
  // const paletteColors = COLOR_PALETTES[
  //   Math.floor(Math.random() * COLOR_PALETTES.length)
  // ].colors.map((color) => color);
  // shuffleArray(paletteColors);
  // return paletteColors.slice(n);
};

export const getContrastColor = (hex: string) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate the luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If the luminance is high, a dark icon is better, otherwise, a white icon is better
  return luminance > 128 ? "dark" : "white";
};

const LINKED_THEME = [
  "#BBA3E2",
  "#FDC891",
  "#96BEFC",
  "#B2DEA0",
  "#DFDEDE",
  "#DEA0BE",
  "#F5785E",
  "#A2D2D9",
  "#E7F189",
];
