import { Router } from "express";
import { acronym } from "./acronym";
import { random } from "./random";
import { user } from "./user";

export const router = Router();

router.use("/acronym", acronym);
router.use("/random", random);
router.use("/user", user);
