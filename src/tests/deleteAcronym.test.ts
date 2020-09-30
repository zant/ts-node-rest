import request from "supertest";
import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import { Acronym } from "../entity/Acronym";
import { User } from "../entity/User";

let app: Application;
let connection: Maybe<Connection>;

const initialAcronym = "YOLO";
const email = "user";
const password = "password";

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();

  // Create stuff we need
  await Acronym.create({
    acronym: initialAcronym,
    meaning: "You only life once",
  }).save();
  await User.create({ email, password }).save();
});

describe("DELETE /acronym/:acronym", () => {
  it("Deletes acronym", async () => {
    const login = await request(app)
      .post(`/user/login`)
      .send({ email, password });
    const { token } = login.body;

    const response = await request(app)
      .delete(`/acronym/${initialAcronym}`)
      .set({ authorization: `Bearer ${token}` });

    expect(response.status).toEqual(204);

    const acronymResponse = await request(app).get(
      `/acronym/${initialAcronym}`
    );
    expect(acronymResponse.status).toEqual(404);
  });

});

afterAll(async () => {
  await connection?.close();
});
