import { getDataLines } from "../utils";

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const dataLines = getDataLines();

const allPositionsVisited: Set<string> = new Set<string>();

/**
 * Finds the starting position marked by "^" in the input data.
 * @returns A tuple of [row, column] coordinates.
 * @throws Error if no starting position ("^") is found.
 */
const getStartingPosition = (): [number, number] => {
  for (let i = 0; i < dataLines.length; i++) {
    const j = dataLines[i].indexOf("^");
    if (j !== -1) {
      const position: [number, number] = [i, j];
      allPositionsVisited.add(`${i},${j}`);
      return position;
    }
  }
  throw new Error("No starting position ('^') found in input data");
};

const getNextPosition = (
  currentPosition: [number, number],
  direction: Direction
): [number, number] | null => {
  let nextPosition: [number, number] = [-1, -1];
  switch (direction) {
    case Direction.Up:
      nextPosition = [currentPosition[0] - 1, currentPosition[1]];
      break;
    case Direction.Down:
      nextPosition = [currentPosition[0] + 1, currentPosition[1]];
      break;
    case Direction.Left:
      nextPosition = [currentPosition[0], currentPosition[1] - 1];
      break;
    case Direction.Right:
      nextPosition = [currentPosition[0], currentPosition[1] + 1];
      break;
  }
  if (
    nextPosition[0] > dataLines.length - 1 ||
    nextPosition[0] < 0 ||
    nextPosition[1] > dataLines[0].length - 1 ||
    nextPosition[1] < 0
  ) {
    return null;
  }
  return nextPosition;
};

const predictGuardPath = (startingPosition: [number, number]) => {
  let currentPosition: [number, number] = startingPosition;
  let direction: Direction = Direction.Up;
  let nextPosition: [number, number] | null;
  while ((nextPosition = getNextPosition(currentPosition, direction))) {
    const [row, col] = nextPosition;
    if (dataLines[row][col] === "#") {
      direction = (direction + 1) % 4;
      continue;
    }
    allPositionsVisited.add(`${row},${col}`);
    currentPosition = nextPosition;
  }
};

const guardGallivantP1 = (): number => {
  const startingPosition = getStartingPosition();
  predictGuardPath(startingPosition);
  return allPositionsVisited.size;
};

console.log(guardGallivantP1());
