import { Request, Response, Router } from "express";
import { Acronym } from "../entity/Acronym";

export const acronym: Router = Router();

acronym.get("/", async (req: Request, res: Response) => {
  let from = 0;
  let limit = 2;

  if (typeof req.query.from !== "undefined") {
    from = Number(req.query.from);
  }

  if (typeof req.query.limit !== "undefined") {
    limit = Number(req.query.from);
  }

  try {
    const acronyms = await Acronym.find({
      order: {
        acronym: "ASC",
      },
      skip: from,
      take: limit,
    });
    res.json({
      acronyms,
    });
  } catch (e) {
    res.status(400);
    res.json({ error: "Sorry dude" });
  }
});

acronym.post("/", async (_: Request, res: Response) => {
  res.status(200);
  const acronym = await Acronym.create({
    acronym: "ABBA",
    meaning: "Lol",
  });
  res.json({ acronym: "hola" });
});
