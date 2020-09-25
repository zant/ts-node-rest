import request from "supertest";
import { seed } from "../scripts/seed";
import { createApp } from "../startServer";
import acronyms from "../../acronyms.json";
import { convertData, removeId } from "../utils/convertData";

let runningApp: RunningApp;

beforeAll(async () => {
  runningApp = await createApp();
  await seed();
});

describe("Get acronyms", () => {
  it("List all acronyms", async () => {
    const response = await request(runningApp.app).get("/acronym");
    const json = response.body;
    expect(removeId(json.acronyms)).toEqual(convertData(acronyms).slice(0, 2));
  });
});

afterAll(async () => {
  await runningApp.connection?.close();
});
