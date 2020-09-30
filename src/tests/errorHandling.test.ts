import { Application } from "express";
import request from "supertest";
import { createApp } from "../app";

let app: Application;

beforeAll(async () => {
  app = await createApp();
});

describe("Handle errors", () => {
  it("Returns not found on unknown slug", async () => {
    const path = "/not-a-page";
    const response = await request(app).get(path);
    expect(response.status).toEqual(404);
    expect(response.body.errors).toEqual([{ message: "Not found", path }]);
  });
});
