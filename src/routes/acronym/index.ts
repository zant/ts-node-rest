import { NextFunction, Request, Response, Router } from "express";
import { Like } from "typeorm";
import { Acronym } from "../../entity/Acronym";
import { createError } from "../../utils/errors";
import * as yup from "yup";
import { formatYupError } from "../../utils/formayYupError";
import { requiredField } from "../../utils/errorMessages";

export const acronym: Router = Router();

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
  } catch (e) {
    next(createError("An error ocurred while getting acronyms", 501));
  }
});

acronym.get(
  "/:acronym",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const acronym = await Acronym.findOne({
        where: { acronym: req.params.acronym },
      });
      res.status(200).json({ acronym });
    } catch (err) {
      next(createError("An error ocurred", 501, err));
    }
  }
);

const schema = yup.object().shape({
  acronym: yup.string().required(requiredField),
  meaning: yup.string().required(requiredField),
});

acronym.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    next(formatYupError(error));
  }

  const { acronym, meaning } = req.body;

  try {
    const created = await Acronym.create({ acronym, meaning }).save();
    res.status(200).json({ acronym: created });
  } catch (err) {
    next(err);
  }
});
