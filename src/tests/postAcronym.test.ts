import { Application } from "express";
import { Connection } from "typeorm";
import { createApp } from "../app";
import { Maybe } from "../types";
import { createTypeormConn } from "../utils/createTypeormConn";
import request from "supertest";
import { requiredField } from "../routes/acronym/errorMessages";

let app: Application;
let connection: Maybe<Connection>;

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
});

describe("POST /acronym", () => {
  it("Receives an acronym and adds it to DB", async () => {
    const acronymToCreate = { acronym: "NP", meaning: "No problem" };
    const response = await request(app).post("/acronym").send(acronymToCreate);
    const { acronym } = response.body;
    expect(acronym.acronym).toEqual(acronymToCreate.acronym);
    expect(acronym.meaning).toEqual(acronymToCreate.meaning);
    expect(acronym.id).not.toBe(undefined);
  });

  it("Returns errors if body is not valid", async () => {
    const response = await request(app).post("/acronym").send();
    const { errors } = response.body;
    expect(errors.length).toBe(2);
    expect(errors).toEqual([
      {
        path: "acronym",
        message: requiredField,
      },
      {
        path: "meaning",
        message: requiredField,
      },
    ]);
  });
});

afterAll(async () => {
  await connection?.close();
});
