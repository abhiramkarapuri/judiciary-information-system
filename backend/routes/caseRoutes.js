import express from "express";
import {
  createCase,
  getAllCases,
  getCaseById,
  addSession,
  closeCase
} from "../controllers/caseController.js";

import { isLoggedIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", isLoggedIn, createCase);

router.get("/", isLoggedIn, getAllCases);

router.get("/:id", isLoggedIn, getCaseById);

router.post("/:id/session", isLoggedIn, addSession);

router.patch("/:id/close", isLoggedIn, closeCase);

export default router;