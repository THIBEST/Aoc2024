import { getDataLines } from "../utils";

const dataLines = getDataLines();

/**
 * Create a map of rules dependencies ().
 * @param rules The rules to process.
 * @returns A map of rules dependencies.
 */
const createRulesDependencies = (rules: string[]): Map<number, number[]> => {
  return rules.reduce((orderedRules: Map<number, number[]>, rule) => {
    const [pageNeeded, pageNum] = rule.split("|").map(Number);
    const currentArr = orderedRules.get(pageNum) ?? [];
    currentArr.push(pageNeeded);
    orderedRules.set(pageNum, currentArr);
    return orderedRules;
  }, new Map());
};

/**
 * Get good updates. A good update is an update where all the pages are in the
 * correct order. This order is defined by the rules.
 * @param updates The updates to process.
 * @param orderedRules The ordered rules.
 * @returns The good updates.
 */
const getGoodUpdates = (
  updates: string[],
  orderedRules: Map<number, number[]>
): string[] => {
  return updates.filter((update) => {
    const updatePages = update.split(",").map(Number);
    for (let i = 0; i < updatePages.length; i++) {
      const currentPage = updatePages[i];
      if (!orderedRules.has(currentPage)) {
        continue;
      }

      const nextPages = updatePages.slice(i + 1);
      if (
        nextPages.some((nextPage) =>
          orderedRules.get(currentPage)?.includes(nextPage)
        )
      ) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Calculate the sum of the number of the middle page of each update.
 * @param updates The updates to process.
 * @returns The sum of the number of the middle page of each update.
 */
const calculateMiddlePageSum = (updates: string[]): number => {
  return updates.reduce((acc, update) => {
    const updatePages = update.split(",").map(Number);
    const middlePage = updatePages[Math.floor(updatePages.length / 2)];
    return acc + middlePage;
  }, 0);
};

/**
 * The first part of the Print Queue challenge.
 * @returns The sum of the number of the middle page of each good update.
 */
const printQueueP1 = (): number => {
  const rules = dataLines.filter((x) => x.includes("|"));
  const rulesDependencies = createRulesDependencies(rules);
  const updates = dataLines.filter((x) => x.includes(","));
  const goodUpdates = getGoodUpdates(updates, rulesDependencies);
  return calculateMiddlePageSum(goodUpdates);
};

console.log(printQueueP1());
