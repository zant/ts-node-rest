import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import request from "supertest";
import { User } from "../entity/User";
import { verify } from "jsonwebtoken";
import { ACCESS_EXPIRY_TIME } from "../utils/authentication";
import { cookieParser } from "../utils/cookieParser";
import { invalidLogin } from "../routes/user/errorMessages";

let app: Application;
let connection: Maybe<Connection>;

const userData = {
  email: "user@g2i.co",
  password: "12345secret",
};

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
  await User.create({ ...userData }).save();
});

describe("Login", () => {
  it.skip("Should login valid user", async () => {
    const response = await request(app).post("/user/login").send(userData);
    const { user, token, expiryTime } = response.body;

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret || !accessTokenSecret) {
      throw new Error("Token secrets are not set");
    }

    expect(user.email).toEqual(userData.email);
    expect(user.password).not.toEqual(userData.password);
    expect(verify(token, accessTokenSecret)).toBeTruthy();
    expect(expiryTime).toBe(ACCESS_EXPIRY_TIME);

    const cookie = response.headers["set-cookie"][0];
    const [name, refreshToken] = cookieParser(cookie)[0];
    expect(name).toEqual("_qid");
    expect(verify(refreshToken, refreshTokenSecret)).toBeTruthy();
  });
  it("Show return invalid login if user does not exists", async () => {
    const path = `/user/login`;
    const response = await request(app)
      .post(path)
      .send({ email: "email@yo.com", password: "pass" });

    expect(response.status).toEqual(401);
    expect(response.body.errors).toEqual([{ message: invalidLogin, path }]);
  });
});

afterAll(async () => {
  await connection?.close();
});
