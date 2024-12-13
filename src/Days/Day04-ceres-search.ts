import { getDataLines } from "../utils";

const dataLines = getDataLines();
const allLetters: string[][] = dataLines.map((line) => line.split(""));

/**
 * Check the presence of the XMAS pattern in a list of letters.
 * @param letters The list of letters.
 * @returns The number of times the pattern is present.
 */
const checkXMASPatternPresence = (letters: string[]): number => {
  const lettersJoined = letters.join("");
  const howManyXMAS = lettersJoined.match(/XMAS/g)?.length || 0;
  const howManySAMX = lettersJoined.match(/SAMX/g)?.length || 0;
  return howManyXMAS + howManySAMX;
};

/**
 * Check the presence of the XMAS pattern in the rows of a list of letters.
 * @returns The number of times the pattern is present in the rows.
 */
const checkRows = (): number =>
  allLetters.reduce((acc, cur) => acc + checkXMASPatternPresence(cur), 0);

/**
 * Check the presence of the XMAS pattern in the columns of a list of letters.
 * @returns The number of times the pattern is present in the columns.
 */
const checkColumns = (): number => {
  let totalOccurences = 0;
  for (let col = 0; col < allLetters[0].length; col++) {
    const column = allLetters.map((line) => line[col]);
    totalOccurences += checkXMASPatternPresence(column);
  }
  return totalOccurences;
};

/**
 * Check the presence of the XMAS pattern in the left-to-right diagonals of a
 * list of letters.
 * @returns The number of times the pattern is present in the left-to-right
 * diagonals.
 */
const checkLeftToRightDiagonals = (): number => {
  let totalOccurences = 0;

  for (let col = 0; col < allLetters[0].length - 3; col++) {
    const diagonal = allLetters.map((line, index) => line[index + col]);
    totalOccurences += checkXMASPatternPresence(diagonal);
  }

  for (let row = 1; row < allLetters.length - 3; row++) {
    const diagonal = allLetters.map((line, index) => line[index - row]);
    totalOccurences += checkXMASPatternPresence(diagonal);
  }

  return totalOccurences;
};

/**
 * Check the presence of the XMAS pattern in the right-to-left diagonals of a
 * list of letters.
 * @returns The number of times the pattern is present in the right-to-left
 * diagonals.
 */
const checkRightToLeftDiagonals = (): number => {
  let totalOccurences = 0;

  for (let col = allLetters[0].length - 1; col > 2; col--) {
    const diagonal = allLetters.map((line, index) => line[col - index]);
    totalOccurences += checkXMASPatternPresence(diagonal);
  }

  for (let row = 1; row < allLetters.length - 3; row++) {
    const diagonal = allLetters.map(
      (line, index) => line[line.length - 1 - index + row]
    );
    totalOccurences += checkXMASPatternPresence(diagonal);
  }

  return totalOccurences;
};

/**
 * Check the presence of the XMAS pattern in the diagonals of a list of letters.
 * @returns The number of times the pattern is present in the diagonals.
 */
const checkDiagonals = (): number =>
  checkLeftToRightDiagonals() + checkRightToLeftDiagonals();

/**
 * The first part of the Ceres Search challenge.
 * @returns The number of times the XMAS pattern is present.
 */
const cereSearchP1 = (): number =>
  checkRows() + checkColumns() + checkDiagonals();

console.log("Ceres Search P1:", cereSearchP1());
