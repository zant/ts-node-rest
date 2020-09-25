import express, { Request, Response } from "express";
import { createTypeormConn } from "./utils/createTypeormConn";
import { router } from "./routes";
import { Server } from "http";

const PORT = 3000;
export const createApp = async (): Promise<RunningApp> => {
  const app = express();

  const connection = await createTypeormConn();

  app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ msg: "Hello world" });
  });

  app.use(router);

  return { app, connection };
};

export const startServer = async (): Promise<Server> => {
  const { app, connection } = await createApp();

  const server = app.listen(PORT, () =>
    console.log(`Server started at ${PORT}`)
  );

  server.on("close", async () => {
    await connection?.close();
  });

  return server;
};
