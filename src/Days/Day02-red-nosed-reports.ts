import { getDataLines } from "../utils";

const dataLines = getDataLines();

/**
 * Create a report from a line of input data.
 * @param line The line of input data.
 * @returns A list of numbers.
 */
const createReport = (line: string): number[] => {
  return line.split(/\s+/).map((x) => parseInt(x));
};

/**
 * Check the conditions for two consecutive numbers in a report to be safe.
 * @param num1 The first number.
 * @param num2 The second number.
 * @param isIncreasing Whether the range is increasing or decreasing.
 * @returns True if the numbers are safe, false otherwise.
 */
const checkConditions = (
  num1: number,
  num2: number,
  isIncreasing: boolean
): boolean => {
  const currentIncreasing = num1 < num2;
  const diff = Math.abs(num1 - num2);
  return currentIncreasing === isIncreasing && diff > 0 && diff <= 3;
};

/**
 * Check if a report is safe.
 * @param report The report to check.
 * @returns True if the report is safe, false otherwise.
 */
const isReportSafe = (report: number[]): boolean => {
  if (report.length <= 1) {
    return true;
  }

  if (report[0] === report[1]) {
    return false;
  }

  const isIncreasing = report[0] < report[1];

  for (let i = 0; i < report.length - 1; i++) {
    if (!checkConditions(report[i], report[i + 1], isIncreasing)) {
      return false;
    }
  }

  return true;
};

/**
 * Check if a report is safe with a problem dampener.
 * The problem dampener is to allow a single error in the report.
 * This means that we can remove one number from the report and still
 * have a safe report.
 * @param report The report to check.
 * @returns True if the report is safe, false otherwise.
 */
const isReportSafeWithProblemDampener = (report: number[]): boolean => {
  if (isReportSafe(report)) {
    return true;
  }

  /**
   * Remove one number from the report and check if it is now safe.
   */
  for (let i = 0; i < report.length; i++) {
    const trimmedReport = report.slice();
    trimmedReport.splice(i, 1);

    if (isReportSafe(trimmedReport)) {
      return true;
    }
  }

  return false;
};

/**
 * The first part of the red nosed reports challenge.
 * @returns The number of safe reports.
 */
const redNosedReportsP1 = (): number => {
  return dataLines.reduce((acc, cur) => {
    const report = createReport(cur);
    return acc + (isReportSafe(report) ? 1 : 0);
  }, 0);
};

/**
 * The second part of the red nosed reports challenge.
 * @returns The number of safe reports.
 */
const redNosedReportsP2 = (): number => {
  return dataLines.reduce((acc, cur) => {
    const report = createReport(cur);
    return acc + (isReportSafeWithProblemDampener(report) ? 1 : 0);
  }, 0);
};

console.log("Part 1:", redNosedReportsP1());
console.log("Part 2:", redNosedReportsP2());
