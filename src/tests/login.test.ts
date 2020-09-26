import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import request from "supertest";
import { User } from "../entity/User";

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
  it("Should login valid user", async () => {
    const response = await request(app).post("/user/login").send(userData);
    const { user } = response.body;
    expect(user.email).toEqual(userData.email);
    expect(user.password).not.toEqual(userData.password);
  });
});

afterAll(async () => {
  await connection?.close();
});
