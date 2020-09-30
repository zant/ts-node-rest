import { NextFunction, Request, Response, Router } from "express";
import { Like } from "typeorm";
import * as yup from "yup";
import { Acronym } from "../../entity/Acronym";
import { isUserAuthenticated } from "../../middleware/isUserAuthenticated";
import { NOT_FOUND } from "../../utils/errorMessages";
import { formatYupError } from "../../utils/formayYupError";
import { requiredField } from "./errorMessages";

export const acronym: Router = Router();

// GET
acronym.get("/", async (req: Request, res: Response, next: NextFunction) => {
  let from = 0;
  let limit = 10;
  let search;

  if (typeof req.query.from !== "undefined") {
    from = Number(req.query.from);
  }

  if (typeof req.query.limit !== "undefined") {
    limit = Number(req.query.limit);
  }

  if (typeof req.query.search !== "undefined") {
    search = String(req.query.search);
  }

  const where = search ? { acronym: Like(`%${search}%`) } : {};

  try {
    const [acronyms, total] = await Acronym.findAndCount({
      order: {
        acronym: "ASC",
      },
      skip: from,
      take: limit,
      where,
    });

    const cursor = from + limit;
    if (total > cursor) {
      res.set("Has-More-Results", String(total - cursor));
    }

    res.json({
      acronyms,
    });
  } catch (error) {
    next([{ error, status: 500 }]);
  }
});

acronym.get(
  "/:acronym",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const acronym = await Acronym.findOne({
        where: { acronym: req.params.acronym },
      });
      if (!acronym) {
        next({ error: new Error(NOT_FOUND) });
      }
      res.status(200).json({ acronym });
    } catch (error) {
      next({ error, status: 500 });
    }
  }
);

// POST
const schema = yup.object().shape({
  acronym: yup.string().required(requiredField),
  meaning: yup.string().required(requiredField),
});

acronym.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    next({ errors: formatYupError(error) });
  }

  const { acronym, meaning } = req.body;

  try {
    const created = await Acronym.create({ acronym, meaning }).save();
    res.status(200).json({ acronym: created });
  } catch (error) {
    next({ error, status: 500 });
  }
});

// PUT
acronym.put(
  "/:acronym",
  isUserAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { acronym } = req.params;
      const savedAcronym = await Acronym.findOne({ where: { acronym } });

      if (!acronym || !savedAcronym) {
        return next({ error: new Error(NOT_FOUND) });
      }

      if (req.body?.acronym) {
        savedAcronym.acronym = req.body?.acronym;
      }

      if (req.body?.meaning) {
        savedAcronym.meaning = req.body?.meaning;
      }

      const newAcronym = await savedAcronym.save();
      res.status(202).json({
        acronym: newAcronym,
      });
    } catch (error) {
      next({ error, status: 500 });
    }
  }
);

acronym.delete(
  "/:acronym",
  isUserAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const savedAcronym = await Acronym.findOne({
        where: { acronym: req.params.acronym },
      });

      if (!savedAcronym) {
        return next({ error: NOT_FOUND });
      }

      await savedAcronym?.remove();
      res.sendStatus(204);
    } catch (error) {
      next({ error, status: 500 });
    }
  }
);
