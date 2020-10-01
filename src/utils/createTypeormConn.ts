import {
  Connection,
  createConnection,
  getConnectionManager,
  getConnectionOptions,
} from "typeorm";

export const createTypeormConn = async (): Promise<Connection | undefined> => {
  if (getConnectionManager().has("default")) return;
  let dbName = process.env.NODE_ENV;
  
  const isDocker = process.env.__DOCKER__;
  if (isDocker) {
    dbName = `${dbName}-container`;
  }

  const connectionOptions = await getConnectionOptions(dbName);
  return createConnection({ ...connectionOptions, name: "default" });
};
