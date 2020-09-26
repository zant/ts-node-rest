export const ErrorHandler = (
  foo: (err: Error, res: Response, req: Request) => void
): void => {
  console.log(foo);
};
