import bodyParser from "body-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { ServerError } from "./types";
import { formatError } from "./utils/errorMessages";

export const createApp = async (): Promise<Application> => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  app.use(bodyParser.json());
  app.use(cors())

  app.get("/", (_: Request, res: Response) => {
    res.redirect("/acronym");
  });

  app.use(router);

  // Not found fallback
  app.get("*", (_: Request, __: Response, next: NextFunction) => {
    next({ status: 404, error: new Error("Not found") });
  });

  // If we're not on prod, show the stack trace
  if (!isProduction) {
    app.use(
      (err: ServerError, req: Request, _: Response, next: NextFunction) => {
        next({
          errors: err.errors || formatError(err, req),
          message: err.error?.message,
          error: err.error?.stack,
          status: err.status,
        });
      }
    );
  } else {
    // On prod show only client errors
    app.use(
      (err: ServerError, req: Request, _: Response, next: NextFunction) => {
        next({
          status: err.status,
          errors: err.errors || formatError(err, req),
        });
      }
    );
  }

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: ServerError, req: Request, res: Response, _next: NextFunction) => {
      res.status(err.status || 404);
      res.json({
        errors: err.errors || { message: "Not found", path: req.originalUrl },
      });
    }
  );

  return app;
};
