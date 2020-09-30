import { Application } from "express";
import request from "supertest";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Acronym } from "../entity/Acronym";
import { User } from "../entity/User";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";

let app: Application;
let connection: Maybe<Connection>;

let acronymId: string;
const initialAcronym = "YOLO";
const email = "user";
const password = "password";

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();

  // Create stuff we need
  const ac = await Acronym.create({
    acronym: initialAcronym,
    meaning: "You only life once",
  }).save();
  acronymId = ac.id;
  await User.create({ email, password }).save();
});

describe("PUT acronym/:acronym", () => {
  it("Updates acronym", async () => {
    const newMeaning = "You only live once";
    const login = await request(app)
      .post(`/user/login`)
      .send({ email, password });
    const { token } = login.body;
    const response = await request(app)
      .put(`/acronym/${initialAcronym}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ meaning: newMeaning });

    const { acronym, id, meaning } = response.body.acronym;
    expect(acronym).toEqual(initialAcronym);
    expect(meaning).toEqual(newMeaning);
    expect(id).toEqual(acronymId);
  });
});

afterAll(async () => {
  await connection?.close();
});
