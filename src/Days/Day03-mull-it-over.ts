import { getDataLines } from "../utils";

const dataLines = getDataLines();

/**
 * Get matches from a line of input data.
 * The pattern is mul(X,Y) where X and Y are numbers with 1 to 3 digits.
 * @param line The line of input data.
 * @returns The matches found, or null if no pattern is found.
 */
const getMatches = (line: string): RegExpMatchArray | null => {
  const groups = line.match(/mul\(\d{1,3},\d{1,3}\)/g);
  if (groups) {
    return groups;
  }
  return null;
};

/**
 * Get matches from a line of input data.
 * The pattern is (don't|do) (mul(X,Y)) where X and Y are numbers with 1 to 3
 * digits.
 * @param line The line of input data.
 * @returns The matches found, or null if no pattern is found.
 */
const getMatchesWithDosAndDonts = (line: string): RegExpMatchArray | null => {
  const groups = line.match(/(don't|do) (mul\(\d{1,3},\d{1,3}\))/g);
  if (groups) {
    return groups;
  }
  return null;
};

/**
 * Get the numbers from a group of matches.
 * The group is in the format mul(X,Y) where X and Y are numbers with 1 to 3 digits.
 * @param group The group of matches.
 * @returns The numbers found, or [0, 0] if no numbers are found.
 */
const getNumbersFromGroup = (group: string): [number, number] => {
  const numbers = group.match(/\d+/g);
  if (numbers) {
    return [parseInt(numbers[0]), parseInt(numbers[1])];
  }
  return [0, 0];
};

/**
 * The first part of the mull it over challenge.
 * @returns The sum of the products of the numbers in the matches.
 */
const mullItOverP1 = (): number => {
  return dataLines.reduce((acc, cur) => {
    const groups = getMatches(cur);
    if (groups) {
      return (
        acc +
        groups.reduce((acc2, cur2) => {
          const [num1, num2] = getNumbersFromGroup(cur2);
          return acc2 + num1 * num2;
        }, 0)
      );
    }
    return acc;
  }, 0);
};

/**
 * Update the myDo boolean based on the input string.
 * @param str The input string.
 * @param myDo The current value of myDo.
 * @returns The new value of myDo.
 */
const updateMyDo = (str: string, myDo: boolean): boolean => {
  if (str === "do") {
    return true;
  } else if (str === "don't") {
    return false;
  }
  return myDo;
};

/**
 * The second part of the mull it over challenge.
 * The products are only done if the mul operation is enabled.
 * The "don't" operator is used to disable the mul operation.
 * The "do" operator is used to enable the mul operation.
 * @returns The sum of the products of the numbers in the matches.
 */
const mullItOverP2 = (): number => {
  let myDo = true;
  return dataLines.reduce((acc, cur) => {
    const groups = getMatchesWithDosAndDonts(cur);
    if (!groups) {
      return acc;
    }
    return (
      acc +
      groups.reduce((acc2, cur2) => {
        myDo = updateMyDo(cur2, myDo);
        if (!myDo) {
          return acc2;
        }
        const [num1, num2] = getNumbersFromGroup(cur2);
        return acc2 + num1 * num2;
      }, 0)
    );
  }, 0);
};

console.log("Part 1:", mullItOverP1());
console.log("Part 2:", mullItOverP2());
