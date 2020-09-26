import { Response, Request, NextFunction, Router } from "express";
import * as yup from "yup";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "../../utils/errorMessages";
import { formatYupError } from "../../utils/formayYupError";

export const user: Router = Router();

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

user.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      next(formatYupError(err));
    }

    const { email, password } = req.body;

    try {
      const userAlreadyExists = await User.findOne({ where: { email } });

      if (userAlreadyExists) {
        next([{ path: "user/register", message: duplicateEmail }]);
      }

      const user = await User.create({ email, password }).save();
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

user.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      next(formatYupError(err));
    }

    const { email, password } = req.body;

    const userAlreadyExists = await User.findOne({ where: { email } });

    if (userAlreadyExists) {
      next([{ path: "user/register", message: duplicateEmail }]);
    }

    try {
      const user = await User.create({ email, password }).save();
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

user.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (req?.session?.userId) {
      req.session.userId = user?.id;
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});
