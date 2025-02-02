import { Router, Request, Response, NextFunction } from "express";
import { Acronym } from "../../entity/Acronym";
import { invalidCount } from "./errorMessages";

export const random: Router = Router();

random.get(
  "/:count",
  async (req: Request, res: Response, next: NextFunction) => {
    const count = req.params.count;
    if (isNaN(Number(count)))
      next({ status: 400, error: new Error(invalidCount) });

    try {
      const acronyms = await Acronym.createQueryBuilder()
        .select("acronym")
        .from(Acronym, "acronym")
        .orderBy("RANDOM()")
        .limit(Number(count))
        .getMany();

      res.status(200).json({ acronyms });
    } catch (error) {
      next({ error, status: 500 });
    }
  }
);
