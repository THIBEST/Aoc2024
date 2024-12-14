import { getDataLines } from "../utils";

const dataLines = getDataLines();
const allLetters: string[][] = dataLines.map((line) => line.split(""));

type XMASPattern = { [key: string]: string };

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
 * Check the presence of the X-MAS pattern in a list of letters.
 * @param letters The list of letters.
 * @returns True if the pattern is present, false otherwise.
 */
const checkX_MASPatternPresence = (letters: XMASPattern): boolean => {
  const topLeft = letters["topLeft"];
  const topRight = letters["topRight"];
  const bottomLeft = letters["bottomLeft"];
  const bottomRight = letters["bottomRight"];
  const centerCell = letters["centerCell"];
  return !!(
    [topLeft, centerCell, bottomRight].join("").match(/MAS|SAM/) &&
    [topRight, centerCell, bottomLeft].join("").match(/MAS|SAM/)
  );
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

/**
 * The second part of the Ceres Search challenge.
 * Looks for an "X" pattern where:
 * M  M
 *  A
 * S  S
 * Both diagonals must form either "MAS" or "SAM".
 * @returns The number of times the X-MAS pattern is present.
 */
const cereSearchP2 = (): number => {
  let totalOccurences = 0;
  for (let i = 1; i < allLetters.length - 1; i++) {
    for (let j = 1; j < allLetters[i].length - 1; j++) {
      const currentX: XMASPattern = {
        centerCell: allLetters[i][j],
      };
      if (currentX.centerCell !== "A") {
        continue;
      }

      currentX.topLeft = allLetters[i - 1][j - 1];
      currentX.topRight = allLetters[i - 1][j + 1];
      currentX.bottomLeft = allLetters[i + 1][j - 1];
      currentX.bottomRight = allLetters[i + 1][j + 1];

      if (checkX_MASPatternPresence(currentX)) {
        totalOccurences++;
      }
    }
  }
  return totalOccurences;
};

console.log("Ceres Search P1:", cereSearchP1());
console.log("Ceres Search P2:", cereSearchP2());
