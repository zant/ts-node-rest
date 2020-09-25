import { Express } from "express";
import { Connection } from "typeorm";

declare global {
  interface RunningApp {
    app: Express;
    connection?: Connection;
  }
}
