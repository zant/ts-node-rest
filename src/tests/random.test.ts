import { Application } from "express";
import request from "supertest";
import { Connection } from "typeorm";
import acronyms from "../../acronyms.json";
import { createApp } from "../app";
import { invalidCount } from "../routes/random/errorMessages";
import { seed } from "../utils/seed";
import { Maybe } from "../types";
import { removeIds } from "../utils/convertData";
import { createTypeormConn } from "../utils/createTypeormConn";

const isSubArray = <T>(arr: Array<T>, sub: Array<T>) => {
  let index: number;
  return sub.every((el) => {
    if (!index) {
      index = arr.indexOf(el);
      return true;
    } else {
      return arr.indexOf(el) === (index += 1);
    }
  });
};

let app: Application;
let connection: Maybe<Connection>;

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
  await seed();
});

describe("GET /random", () => {
  it("isSubArray function works as expected", () => {
    expect(isSubArray([1, 2, 3, 4, 5, 6, 7], [2, 3, 4, 5])).toBe(true);
    expect(isSubArray([1, 2, 3, 4, 5, 6, 7], [5, 3])).toBe(false);
  });

  it("Returns :count random acronyms that are not adjacent", async () => {
    const count = 5;
    const url = `/random/${count}`;
    const response = await request(app).get(url);
    const acronymsResponse = removeIds(response.body.acronyms);

    expect(isSubArray(acronyms, acronymsResponse)).toBe(false);
    expect(acronymsResponse.length).toBe(count);
  });

  it("Returns error if param is NaN", async () => {
    const count = "hola";
    const url = `/random/${count}`;
    const response = await request(app).get(url);
    expect(response.status).toEqual(400);
    expect(response.body.errors).toEqual([
      { message: invalidCount, path: url },
    ]);
  });
});

afterAll(async () => {
  await connection?.close();
});
