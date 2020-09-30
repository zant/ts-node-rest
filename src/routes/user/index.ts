import { Router, NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  invalidLogin,
  passwordNotLongEnough,
} from "./errorMessages";
import { formatYupError } from "../../utils/formayYupError";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/authentication";

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
    } catch (error) {
      next({ errors: formatYupError(error) });
    }

    const { email, password } = req.body;

    try {
      const userAlreadyExists = await User.findOne({ where: { email } });

      if (userAlreadyExists) {
        next({ status: 400, error: new Error(duplicateEmail) });
      }

      const user = await User.create({ email, password }).save();
      res.status(201).json({ user });
    } catch (error) {
      next({ status: 500, error });
    }
  }
);

user.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      next({ status: 401, error: new Error(invalidLogin) });
      return;
    }

    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) {
      next({ status: 401, error: new Error(invalidLogin) });
      return;
    }

    res.cookie("_qid", createRefreshToken(user), {
      httpOnly: true,
    });

    const { token, expiryTime } = createAccessToken(user);

    res.status(200).json({ token, expiryTime, user });
  } catch (error) {
    next({ status: 500, error });
  }
});
