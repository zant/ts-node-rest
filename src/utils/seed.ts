import { readFileSync } from "fs";
import { join } from "path";
import { Acronym } from "../entity/Acronym";
import { User } from "../entity/User";
import { createTypeormConn } from "./createTypeormConn";

export const seed = async (): Promise<void> => {
  await createTypeormConn();

  try {
    await User.create({ email: "user@g2i.co", password: "pass1234" }).save();
  } catch (err) {
    console.log("An error ocurred while creating base user");
  }

  const dbIsNotEmpty = await Acronym.findOne();
  if (dbIsNotEmpty) {
    console.log(
      "DB has at least one acronym, for duplicate reasons seed will not run. Please empty acronym tables if the seed is needed."
    );
  }

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
    if (process.env.NODE_ENV !== "test") await Promise.all(promises);
    if (process.env.NODE_ENV !== "test") console.log("Database seeded 🌱✨");
    if (process.env.NODE_ENV !== "test") console.log("Please wait until end");
  } catch (e) {
    console.log("Error reading file", e);
  }
};
