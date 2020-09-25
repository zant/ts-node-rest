import {
  createConnection,
  getConnectionManager,
  getConnectionOptions,
} from "typeorm";

export const createTypeormConn = async () => {
  if (getConnectionManager().has(process.env.NODE_ENV as string)) return;

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: "default" });
};
