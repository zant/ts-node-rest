import { readFileSync } from "fs";
import { join } from "path";
import { Acronym } from "../entity/Acronym";

export const seed = async () => {
  try {
    const data = readFileSync(join(__dirname, "../../acronyms.json"), "utf-8");
    const items: Record<string, string>[] = JSON.parse(data);

    const promises: Promise<Acronym>[] = [];

    for (const item of items) {
      for (const [key, value] of Object.entries(item)) {
        const acronym = Acronym.create({
          acronym: key,
          meaning: value,
        });
        promises.push(acronym.save());
      }
    }
    await Promise.all(promises);
    console.log("Database seeded 🌱✨");
  } catch (e) {
    console.log("Error reading file", e);
  }
};
