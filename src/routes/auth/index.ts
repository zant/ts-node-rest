import { NextFunction, Request, Response, Router } from "express";
import { User } from "../../entity/User";
import {
  createRefreshToken,
  verifyRefreshToken,
  createAccessToken,
} from "../../utils/authentication";
import { cookieParser } from "../../utils/cookieParser";
import { AUTH_CONFIG, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "../../utils/errorMessages";

export const auth: Router = Router();
const forbiddenError = { status: 403, error: new Error(FORBIDDEN) };
auth.get(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    const { cookie } = req.headers;
    if (!cookie) return next(forbiddenError);

    const { _qid: refreshToken } = cookieParser(cookie);
    if (!refreshToken) return next(forbiddenError)

    try {
      // Cast object to record
      const payload = verifyRefreshToken(refreshToken) as Record<string, string>;
      const { userId, tokenCount } = payload;

      const user = await User.findOne(userId);
      if (!user) return next({ status: 404, error: new Error(NOT_FOUND) });
      if (user?.tokenCount !== Number(tokenCount)) return next(forbiddenError);

      res.cookie("_qid", createRefreshToken(user), {
        httpOnly: true,
      });

      const { token, expiryTime } = createAccessToken(user);
      res.status(200).json({ token, expiryTime });
    } catch (error) {
      if (error.message === AUTH_CONFIG) next({ status: 501, error });
      next({ status: 401, error: new Error(UNAUTHORIZED) });
    }
  }
);
