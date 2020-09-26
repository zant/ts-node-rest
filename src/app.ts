import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import { createError, ServerError } from "./utils/errors";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";

const SESSION_SECRET = "random-cat";

export const createApp = async (): Promise<Application> => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  const RedisStore = connectRedis(session);

  app.use(bodyParser.json());
  app.use(bodyParser.json());

  app.get("/", (_: Request, res: Response) => {
    res.redirect("/acronym");
  });

  app.use(router);
  app.use(
    session({
      store: new RedisStore({ client: redis }),
      name: "qid",
      resave: false,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
      },
    })
  );

  app.use((_: Request, __: Response, next: NextFunction) => {
    next(createError("Not found", 404));
  });

  // If we are on prod env do not show stack trace
  if (!isProduction) {
    app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: ServerError, _: Request, res: Response, __: NextFunction) => {
        res.status(err.status || 404);
        if (Array.isArray(err)) {
          res.json({ errors: err });
        } else {
          res.json({
            message: err.error.message,
            error: err.error.stack,
          });
        }
      }
    );
  }

  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: ServerError, _: Request, res: Response, __: NextFunction) => {
      res.status(404);
      res.json({
        message: err.error.message,
        error: {},
      });
    }
  );

  return app;
};
