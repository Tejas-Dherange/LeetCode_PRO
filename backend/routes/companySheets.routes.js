import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  addProblemToCompanySheet,
  createCompanySheet,
  getCompanySheetProblems,
  getCompanySheets,
  getPremiumCompanySheets,
} from "../controllers/companySheets.controllers.js";
import { checkSubscriptionAccess } from "../middleware/premiumAccess.js";
const router = Router();

router.get("/", isLoggedIn, checkSubscriptionAccess("BASIC"), getCompanySheets);
router.get(
  "/:id/problems",
  isLoggedIn,
  checkSubscriptionAccess("BASIC"),
  getCompanySheetProblems,
);
router.post("/create", isLoggedIn, createCompanySheet);
router.get(
  "/premium-sheets",
  isLoggedIn,
  checkSubscriptionAccess("BASIC"),
  getPremiumCompanySheets,
);

router.post("/add-problem", isLoggedIn, addProblemToCompanySheet);

export default router;
