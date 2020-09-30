import request from "supertest";
import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import { FORBIDDEN, UNAUTHORIZED } from "../utils/errorUtils";
import { User } from "../entity/User";
import { cookieParser } from "../utils/cookieParser";
import { Acronym } from "../entity/Acronym";
import { verify } from "jsonwebtoken";

let app: Application;
let connection: Maybe<Connection>;
const email = "user";
const password = "password";
const initialAcronym = "YOLO";

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
  await User.create({ email, password }).save();
  await Acronym.create({
    acronym: initialAcronym,
    meaning: "You only life once",
  }).save();
});

describe("Authorization in routes", () => {
  it("PUT /acronym/:acronym", async () => {
    const path = `/acronym/${initialAcronym}`;
    const response = await request(app)
      .put(path)
      .send({ meaning: "You only live once" });
    expect(response.status).toEqual(403);
    expect(response.body.errors).toEqual([{ message: FORBIDDEN, path }]);
  });

  it("DELETE /acronym/:acronym", async () => {
    const path = `/acronym/${initialAcronym}`;
    const response = await request(app)
      .delete(path)
      .send({ meaning: "You only live once" });
    expect(response.status).toEqual(403);
    expect(response.body.errors).toEqual([{ message: FORBIDDEN, path }]);
  });
});

describe("Test access and refresh tokens", () => {
  it("Returns error if token is invalid", async () => {
    const path = `/acronym/${initialAcronym}`;
    const response = await request(app)
      .put(path)
      .set({ authorization: `Bearer ajshfjash` })
      .send({ meaning: "whatever" });
    expect(response.status).toEqual(401);
    expect(response.body.errors).toEqual([{ message: UNAUTHORIZED, path }]);
  });
  it("GET /refresh-token Returns token and expiry time if cookie is valid", async () => {
    const login = await request(app)
      .post(`/user/login`)
      .send({ email, password });
    const { token } = login.body;
    const cookie = login.headers["set-cookie"][0];
    const { _qid } = cookieParser(cookie);
    const response = await request(app)
      .get("/refresh-token")
      .set({
        authorization: `Bearer ${token}`,
        cookie: `_qid=${_qid}`,
      });

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret || !accessTokenSecret) {
      throw new Error("Token secrets are not set");
    }
    const { token: newToken } = response.body;

    expect(verify(newToken, accessTokenSecret)).toBeTruthy();
  });
});

afterAll(async () => {
  await connection?.close();
});
