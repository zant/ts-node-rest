import express, { Request, Response } from "express";
import { createTypeormConn } from "./utils/createTypeormConn";
import { router } from "./routes";

const PORT = 3000;

export const createApp = async () => {
  const app = express();

  await createTypeormConn();

  app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ msg: "Hello world" });
  });

  app.use(router);

  return app;
};

export const startServer = async () => {
  const app = await createApp();
  return app.listen(PORT, () => console.log(`Server started at ${PORT}`));
};
