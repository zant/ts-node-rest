import { ClientError, ServerError } from "../types";
import { Request } from "express";

export const formatError = (err: ServerError, req: Request): ClientError[] => {
  return [{ message: err.error?.message, path: req.originalUrl }];
};
export const NOT_FOUND = "Not found";
export const UNAUTHORIZED = "Unauthorized";
export const FORBIDDEN = "Forbidden";
export const AUTH_CONFIG = "Authentication conf is missing";
