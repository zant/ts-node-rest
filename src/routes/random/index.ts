import { Router, Request, Response, NextFunction } from "express";
import { Acronym } from "../../entity/Acronym";

export const random: Router = Router();

random.get(
  "/:count",
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: validate that is a number
    const count = req.params.count;
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
