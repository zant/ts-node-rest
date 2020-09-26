import { Application } from "express";
import request from "supertest";
import { createApp } from "../app";

let app: Application;

beforeAll(async () => {
  app = await createApp();
});

describe("Handle errors", () => {
  it("Returns not found on development", async () => {
    const response = await request(app).get("/not-a-page");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not found");
    expect(response.body.error).not.toBe({});
  });
});
