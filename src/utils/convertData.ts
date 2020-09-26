import { AcronymObject } from "../types";

export const convertData = (
  arr: Record<string, string>[]
): (AcronymObject | undefined)[] => {
  const acronyms: AcronymObject[] = [];
  if (arr.length > 0) {
    for (const el of arr) {
      for (const [key, value] of Object.entries(el)) {
        acronyms.push({ acronym: key, meaning: value });
      }
    }
  }
  // Sort
  return acronyms.sort((a: AcronymObject, b: AcronymObject) => {
    if (b.acronym > a.acronym) return -1;
    return 1;
  });
};

export const removeIds = (arr: Record<string, string>[]): AcronymObject[] => {
  if (!arr) return [];
  return arr.map((el) => ({ acronym: el.acronym, meaning: el.meaning }));
};
