// Utility functions for testing

// TODO: move this
type Acronym = {
  meaning: string;
  acronym: string;
};

export const convertData = (
  arr: Record<string, string>[]
): (Acronym | undefined)[] => {
  const acronyms: Acronym[] = [];
  if (arr.length > 0) {
    for (const el of arr) {
      for (const [key, value] of Object.entries(el)) {
        acronyms.push({ acronym: key, meaning: value });
      }
    }
  }
  // Sort
  return acronyms.sort((a: Acronym, b: Acronym) => {
    if (b.acronym > a.acronym) return -1;
    return 1;
  });
};

export const removeId = (arr: Record<string, string>[]): Acronym[] => {
  return arr.map((el) => ({ acronym: el.acronym, meaning: el.meaning }));
};
