import { Router } from "express";
import { acronym } from "./acronym";
import { random } from "./random";

export const router = Router();

router.use("/acronym", acronym);
router.use("/random", random);
