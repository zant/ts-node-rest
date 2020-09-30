import { Request, Response, NextFunction } from "express";
import { getBearerToken, verifyAccessToken } from "../utils/authentication";
import { AUTH_CONFIG, FORBIDDEN, UNAUTHORIZED } from "../utils/errorMessages";

export const isUserAuthenticated = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return next({ status: 403, error: new Error(FORBIDDEN) });

  const token = getBearerToken(authHeader);
  if (!token) return next({ status: 403, error: new Error(FORBIDDEN) });
  try {
    verifyAccessToken(token);
  } catch (error) {
    if (error.message === AUTH_CONFIG) next({ status: 501, error });
    next({ status: 401, error: new Error(UNAUTHORIZED) });
  }

  next();
};
