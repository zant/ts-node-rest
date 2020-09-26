import { createApp } from "./app";
import { Server } from "http";
import { createTypeormConn } from "./utils/createTypeormConn";

const PORT = 3000;

export const startServer = async (): Promise<Server> => {
  const app = await createApp();
  const connection = await createTypeormConn();

  const server = app.listen(PORT, () =>
    console.log(`Server started at ${PORT}`)
  );

  server.on("close", async () => {
    await connection?.close();
  });

  return server;
};

startServer();
