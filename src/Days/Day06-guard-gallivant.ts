import { getDataLines } from "../utils";

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const dataLines = getDataLines();

type positionVisitedWithDirection = {
  coordinates: [number, number];
  direction: Direction;
};

const allPositionsVisited: Set<string> = new Set();

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
      allPositionsVisited.add(makeKey(position, Direction.Up));
      return position;
    }
  }
  throw new Error("No starting position ('^') found in input data");
};

/**
 * Gets the next position of the guard based on the current position and
 * direction.
 * @param currentPosition The current position of the guard.
 * @param direction The direction the guard is moving.
 * @returns The next position of the guard, or null if the guard exits the map.
 */
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

/**
 * Predicts the path of the guard based on the starting position.
 * @param startingPosition The starting position of the guard.
 */
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
    allPositionsVisited.add(makeKey(nextPosition));
    currentPosition = nextPosition;
  }
};

/**
 * Makes a unique key from a position and direction.
 * @param pos The position of the guard.
 * @param dir The direction of the guard.
 * @returns A string representing the unique key.
 */
const makeKey = (pos: [number, number], dir?: Direction) =>
  `${pos[0]},${pos[1]},${dir}`;

/**
 * Checks if the guard has made a loop.
 * @param startingPosition The starting position of the guard.
 * @param obstaclePosition The position of the obstacle added to create a loop.
 * @returns True if the guard has made a loop, false otherwise.
 */
const checkForLoop = (
  startingPosition: positionVisitedWithDirection,
  obstaclePosition: [number, number]
) => {
  let currentPosition: [number, number] = startingPosition.coordinates;
  let currentDirection: Direction = startingPosition.direction;
  let nextPosition: [number, number] | null;

  const visited = new Set<string>();
  visited.add(makeKey(currentPosition, currentDirection));

  while ((nextPosition = getNextPosition(currentPosition, currentDirection))) {
    const [nextRow, nextCol] = nextPosition;

    if (
      dataLines[nextRow][nextCol] === "#" ||
      (nextRow === obstaclePosition[0] && nextCol === obstaclePosition[1])
    ) {
      currentDirection = (currentDirection + 1) % 4;
      continue;
    }
    currentPosition = nextPosition;

    const key = makeKey(nextPosition, currentDirection);
    if (visited.has(key)) {
      return true;
    }

    visited.add(key);
  }

  return false;
};

/**
 * Predicts the number of paths with loops after adding obstacles based on the
 * normal path the guard would follow.
 * @returns The number of paths with loops after adding obstacles.
 */
const getNumberOfPathsWithLoopAfterAddingObstacles = (
  startingPosition: positionVisitedWithDirection
): number =>
  Array.from(allPositionsVisited).reduce((acc, cur, index) => {
    if (index === 0) {
      return acc;
    }
    const obstaclePosition = cur.split(",").map(Number) as [number, number];
    if (checkForLoop(startingPosition, obstaclePosition)) {
      return acc + 1;
    }
    return acc;
  }, 0);

/**
 * The first part of the Guard Gallivant challenge.
 * @returns The number of unique positions visited by the guard.
 */
const guardGallivantP1 = (): number => {
  const startingPosition = getStartingPosition();
  predictGuardPath(startingPosition);
  return allPositionsVisited.size;
};

/**
 * The second part of the Guard Gallivant challenge.
 * @returns The number of paths with loops after adding obstacles.
 */
const guardGallivantP2 = (): number => {
  const startingPosition: positionVisitedWithDirection = {
    coordinates: getStartingPosition(),
    direction: Direction.Up,
  };
  return getNumberOfPathsWithLoopAfterAddingObstacles(startingPosition);
};

console.log(guardGallivantP1());
console.log(guardGallivantP2());
