export interface ServerError {
  error: Error;
  status: number;
}

export const createError = (
  message: string,
  status: number,
  error?: Error
): ServerError => {
  if (error) {
    return {
      error,
      status,
    };
  }
  return {
    error: new Error(message),
    status,
  };
};
