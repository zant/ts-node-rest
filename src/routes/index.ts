import { Router } from "express";
import { acronym } from "./acronym";

export const router = Router();

router.use("/acronym", acronym);
