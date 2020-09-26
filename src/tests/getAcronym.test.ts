import { Application } from "express";
import request from "supertest";
import { Connection } from "typeorm";
import acronyms from "../../acronyms.json";
import { createApp } from "../app";
import { Maybe } from "../types";
import { seed } from "../scripts/seed";
import { convertData, removeIds } from "../utils/convertData";
import { createTypeormConn } from "../utils/createTypeormConn";

let app: Application;
let connection: Maybe<Connection>;

beforeAll(async () => {
  app = await createApp();
  connection = await createTypeormConn();
  await seed();
});

describe("GET /acronym", () => {
  it("Returns a list of acronyms", async () => {
    const response = await request(app).get("/acronym");
    const acronymsResponse = removeIds(response.body.acronyms);

    expect(acronymsResponse).toEqual(convertData(acronyms).slice(0, 10));
  });

  it("Returns a list of acronyms, paginated using query parameters", async () => {
    const from = 5;
    const limit = 15;
    const url = `/acronym?from=${from}&limit=${limit}`;
    const response = await request(app).get(url);
    const acronymsResponse = removeIds(response.body.acronyms);
    const data = convertData(acronyms).slice(from, from + limit);

    expect(acronymsResponse).toEqual(data);
  });

  it("Response headers indicates that they are more results", async () => {
    const totalAcronyms = acronyms.length;
    const from = totalAcronyms - 2;
    const limit = 1;
    const url = `/acronym?from=${from}&limit=${limit}`;
    const response = await request(app).get(url);

    const paginationHeader = response.headers["has-more-results"];

    expect(paginationHeader).toEqual(String(1));
  });

  it("Response headers indicates they are no more results", async () => {
    const from = 0;
    const limit = 15;
    const search = "TTY";
    const url = `/acronym?from=${from}&limit=${limit}&search=${search}`;
    const response = await request(app).get(url);
    const paginationHeader = response.headers["has-more-results"];
    expect(paginationHeader).toBeUndefined();
  });

  /* 
   The app is using postgres LIKE query so it will probably get more
   stuff than indexOf() most of the time, but for testing this works well enough
  */
  it("Returns all acronyms that fuzzy match against :search", async () => {
    const search = "TTY";
    const url = `/acronym?search=${search}`;
    const response = await request(app).get(url);
    const acronymsResponse = removeIds(response.body.acronyms);
    const data = convertData(acronyms).filter(
      (el) => el?.acronym.indexOf(search) !== -1
    );
    expect(acronymsResponse).toEqual(data);
  });

  it("Returns the acronym and definition matching :acronym", async () => {
    const acronym = "TTYL";
    const url = `/acronym/${acronym}`;
    const response = await request(app).get(url);
    const data = convertData(acronyms).filter((el) => el?.acronym === acronym);
    expect(response.body.acronym.acronym).toEqual(data[0]?.acronym);
    expect(response.body.acronym.meaning).toEqual(data[0]?.meaning);
  });
});

afterAll(() => {
  connection?.close();
});
