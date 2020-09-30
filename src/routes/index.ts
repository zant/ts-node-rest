import { Router } from "express";
import { acronym } from "./acronym";
import { random } from "./random";
import { user } from "./user";
import { auth } from "./auth";

export const router = Router();

router.use("/", auth);
router.use("/acronym", acronym);
router.use("/random", random);
router.use("/user", user);
