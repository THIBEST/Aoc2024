import { getDataLines } from "./utils";

const dataLines = getDataLines();

/**
 * Create two lists from the input data.
 * @param dataLines The lines of input data.
 * @returns A tuple containing two lists of numbers.
 */
const createLists = (dataLines: string[]): [number[], number[]] => {
  const leftList: number[] = [];
  const rightList: number[] = [];

  dataLines.forEach((line) => {
    const [left, right] = line.split(/\s+/);
    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
  });

  return [leftList, rightList];
};

/**
 * Calculate the distance between two lists of numbers.
 * This is done by taking the absolute value of the difference between
 * each corresponding number in the lists.
 * @param leftList The first list of numbers.
 * @param rightList The second list of numbers.
 * @returns The distance between the two lists.
 */
const calculateDistance = (leftList: number[], rightList: number[]): number => {
  return leftList.reduce((acc, cur, index) => {
    return acc + Math.abs(cur - rightList[index]);
  }, 0);
};

/**
 * Create a frequency map for a list of numbers.
 * @param list The list of numbers.
 * @returns A map where the keys are the numbers in the list and the
 * values are the frequency of each number.
 */
const createFrenquencyMap = (list: number[]): Map<number, number> => {
  const frequencies: Map<number, number> = new Map();
  for (const value of list) {
    frequencies.set(value, (frequencies.get(value) || 0) + 1);
  }
  return frequencies;
};

/**
 * Calculate the similarity between two lists of numbers.
 * This is done by counting the number of times each number in the first
 * list appears in the second list.
 * @param leftList The first list of numbers.
 * @param rightList The second list of numbers.
 * @returns The similarity between the two lists.
 */
const calculateSimilarity = (
  leftList: number[],
  rightList: number[]
): number => {
  const rightFrequencies = createFrenquencyMap(rightList);

  return leftList.reduce((acc, cur) => {
    return acc + cur * (rightFrequencies.get(cur) || 0);
  }, 0);
};

/**
 * The first part of the historian hysteria challenge.
 * @returns The distance between the two lists.
 */
const historianHysteriaP1 = (): number => {
  const [leftList, rightList] = createLists(dataLines);
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);
  return calculateDistance(leftList, rightList);
};

/**
 * The second part of the historian hysteria challenge.
 * @returns The similarity between the two lists.
 */
const historianHysteriaP2 = (): number => {
  const [leftList, rightList] = createLists(dataLines);
  return calculateSimilarity(leftList, rightList);
};

console.log("Part 1:", historianHysteriaP1());
console.log("Part 2:", historianHysteriaP2());
