import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import { createError, ServerError } from "./utils/errors";

export const createApp = async (): Promise<Application> => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  app.use(bodyParser.json());

  app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ msg: "Hello world" });
  });

  app.use(router);

  app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError("Not found", 404));
  });

  // If we are on prod env do not show stack trace
  if (!isProduction) {
    app.use(
      (err: ServerError, _: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 404);
        if (Array.isArray(err)) {
          res.json({ errors: err });
        } else {
          res.json({
            message: err.error.message,
            error: err.error.stack,
          });
        }
        next();
      }
    );
  }

  app.use((err: ServerError, _: Request, res: Response, next: NextFunction) => {
    res.status(404);
    res.json({
      message: err.error.message,
      error: {},
    });
    next();
  });

  return app;
};
