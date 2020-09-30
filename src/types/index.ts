export interface AcronymObject {
  meaning: string;
  acronym: string;
}

export type FormattedError = { path: string; message: string };

export type Maybe<T> = T | undefined;

export interface ServerError {
  error?: Error;
  status?: number;
  errors: ClientError[];
}

export interface ClientError {
  message?: string;
  path?: string;
}
