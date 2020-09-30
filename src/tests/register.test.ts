import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import request from "supertest";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "../routes/user/errorMessages";

let app: Application;
let connection: Maybe<Connection>;

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
});

describe("Register", () => {
  it("Successfully register", async () => {
    const userData = { email: "test@test.com", password: "12345" };
    const response = await request(app).post("/user/register").send(userData);
    const { user } = response.body;
    expect(response.status).toEqual(201);
    expect(user.email).toEqual(userData.email);
    expect(user.password).not.toEqual(userData.password);
  });

  it("Should not register an user with duplicate email", async () => {
    const userData = { email: "test@test.com", password: "12345" };
    const response = await request(app).post("/user/register").send(userData);
    expect(response.body.errors).toEqual([
      { path: "/user/register", message: duplicateEmail },
    ]);
  });

  it("Should not register an user with invalid email and invalid password", async () => {
    const userData = { email: "@", password: "1" };
    const response = await request(app).post("/user/register").send(userData);
    expect(response.body.errors).toEqual([
      { path: "email", message: emailNotLongEnough },
      { path: "email", message: invalidEmail },
      { path: "password", message: passwordNotLongEnough },
    ]);
  });

  it("Should not register an user with invalid email", async () => {
    const userData = { email: "test.com", password: "1239230" };
    const response = await request(app).post("/user/register").send(userData);
    expect(response.body.errors).toEqual([
      { path: "email", message: invalidEmail },
    ]);
  });
});

afterAll(async () => {
  await connection?.close();
});
