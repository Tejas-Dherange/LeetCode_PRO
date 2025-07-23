import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  getCompanySheetProblems,
  getCompanySheets,
} from "../controllers/companySheets.controllers.js";
import { checkSubscriptionAccess } from "../middleware/premiumAccess.js";
const router = Router();

router.get("/", isLoggedIn, checkSubscriptionAccess("BASIC"), getCompanySheets);
router.get(
  "/:id/problems",
  isLoggedIn,
  checkSubscriptionAccess("BASIC"),
  getCompanySheetProblems
);

export default router;
