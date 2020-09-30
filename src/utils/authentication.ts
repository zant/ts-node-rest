import { sign, verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { Maybe } from "../types";
import { AUTH_CONFIG } from "./errorMessages";

export const ACCESS_EXPIRY_TIME = "15m";
export const REFRESH_EXPIRY_TIME = "7d";

export const createAccessToken = (
  user: User
): { token: string; expiryTime: string } => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) throw new Error(AUTH_CONFIG);
  return {
    token: sign({ userId: user.id }, accessTokenSecret, {
      expiresIn: ACCESS_EXPIRY_TIME,
    }),
    expiryTime: ACCESS_EXPIRY_TIME,
  };
};

export const createRefreshToken = (user: User): string => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) throw new Error(AUTH_CONFIG);
  return sign(
    { userId: user.id, tokenCount: user.tokenCount },
    refreshTokenSecret,
    {
      expiresIn: REFRESH_EXPIRY_TIME,
    }
  );
};

export const getBearerToken = (authHeader: Maybe<string>): Maybe<string> =>
  authHeader && authHeader.split(" ")[1];

export const verifyAccessToken = (
  token: string
  // eslint-disable-next-line @typescript-eslint/ban-types
): string | object => {
  const accessToken = process.env.ACCESS_TOKEN_SECRET;
  if (!accessToken) throw new Error("Authorization config missing");
  return verify(token, accessToken);
};

export const verifyRefreshToken = (
  token: string
  // eslint-disable-next-line @typescript-eslint/ban-types
): string | object => {
  const refreshToken = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshToken) throw new Error("Authorization config missing");
  return verify(token, refreshToken);
};
