import { getDataLines } from "../utils";

const dataLines = getDataLines();

const updates = dataLines.filter((x) => x.includes(","));
const rules = dataLines.filter((x) => x.includes("|"));

/**
 * Create a map of rules dependencies.
 * @param rules The rules to process.
 * @returns A map of rules dependencies.
 */
const createRulesDependencies = (rules: string[]): Map<number, number[]> =>
  rules.reduce((orderedRules: Map<number, number[]>, rule) => {
    const [pageNeeded, pageNum] = rule.split("|").map(Number);
    const currentArr = orderedRules.get(pageNum) ?? [];
    currentArr.push(pageNeeded);
    orderedRules.set(pageNum, currentArr);
    return orderedRules;
  }, new Map());

const rulesDependencies = createRulesDependencies(rules);

/**
 * Check if the update is good. A good update is an update where the pages
 * are in the correct order. This order is defined by the rules.
 * @param update The update to check.
 * @returns True if the update is good, false otherwise.
 */
const isGoodUpdate = (update: string): boolean => {
  return update
    .split(",")
    .map(Number)
    .every((currentPage, index, updatePages) => {
      /**
       * If the current page is not dependent on any of the next pages, then
       * this page is good.
       */
      if (!rulesDependencies.has(currentPage)) {
        return true;
      }

      /**
       * We check in the next pages if the current page is dependent on any of
       * them.
       */
      const nextPages = updatePages.slice(index + 1);
      return !nextPages.some((nextPage) =>
        rulesDependencies.get(currentPage)?.includes(nextPage)
      );
    });
};

/**
 * Get the good updates. A good update is an update where all the pages are in
 * the correct order. This order is defined by the rules.
 * @returns The good updates.
 */
const getGoodUpdates = (): string[] => {
  return updates.filter((update) => isGoodUpdate(update));
};

/**
 * Fix the updates by moving the pages in the correct order.
 * @param updates The updates to fix.
 * @returns The fixed updates.
 */
const fixUpdates = (updates: string[]): string[] => {
  return updates.map((update) => {
    const pages = update.split(",").map(Number);
    let fixed = [...pages];

    for (let i = 0; i < fixed.length; i++) {
      const currentPage = fixed[i];
      if (!rulesDependencies.has(currentPage)) {
        continue;
      }

      const dependencies = rulesDependencies.get(currentPage)!;
      const nextPages = fixed.slice(i + 1);

      // If any dependency appears after the current page, we need to move the current page.
      if (nextPages.some((page) => dependencies.includes(page))) {
        // Find the position after the last dependency.
        const lastDependencyIndex = Math.max(
          ...nextPages
            .map((page, index) =>
              /**
               * If the page is a dependency, return the absolute position in
               * the original array. Else, return -1.
               * i + 1 is to account for the current page (start if nextPages).
               * index is the offset in the nextPages array.
               */
              dependencies.includes(page) ? i + 1 + index : -1
            )
            .filter((index) => index !== -1)
        );

        // Move the current page after its last dependency.
        fixed.splice(i, 1); // Remove current page.
        fixed.splice(lastDependencyIndex + 1, 0, currentPage); // Insert after last dependency.
        i--; // Recheck from the previous position since we moved elements.
      }
    }

    return fixed.join(",");
  });
};

/**
 * Get the updates that are wrong. A wrong update is an update where some
 * pages are not in the correct order. This order is defined by the rules.
 * @returns The updates that are wrong.
 */
const getWrongUpdates = (): string[] => {
  return updates.filter((update) => !isGoodUpdate(update));
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
  const goodUpdates = getGoodUpdates();
  return calculateMiddlePageSum(goodUpdates);
};

/**
 * The second part of the Print Queue challenge.
 * @returns The sum of the number of the middle page of each good update.
 */
const printQueueP2 = (): number => {
  const wrongUpdates = getWrongUpdates();
  const fixedUpdates = fixUpdates(wrongUpdates);
  return calculateMiddlePageSum(fixedUpdates);
};

console.log("Print Queue P1:", printQueueP1());
console.log("Print Queue P2:", printQueueP2());
