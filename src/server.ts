import { createApp } from "./app";
import { Server } from "http";
import { createTypeormConn } from "./utils/createTypeormConn";
import { Connection } from "typeorm";
import { Maybe } from "./types";

const PORT = 4000;

export const startServer = async (): Promise<Server> => {
  const app = await createApp();
  let connection: Maybe<Connection>;

  let retries = 5;
  while (retries) {
    try {
      connection = await createTypeormConn();
      break;
    } catch (err) {
      retries--;
      console.log(`DB retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  const server = app.listen(PORT, () =>
    console.log(`Server started at ${PORT}`)
  );

  server.on("close", async () => {
    await connection?.close();
  });

  return server;
};

startServer();
