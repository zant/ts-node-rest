import request from "supertest";
import { create } from "ts-node";
import { seed } from "../scripts/seed";
import { createApp } from "../startServer";

let app;

beforeAll(async () => {
  app = await createApp();
  await seed();
});

describe("Get acronyms", () => {
  it("List all acronyms", async () => {
    const response = await request(app).get("/acronym");
    const text = response.text;
    console.log(text);
  });
});
