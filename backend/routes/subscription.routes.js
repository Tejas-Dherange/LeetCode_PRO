import { Router } from "express";
import {
  cancelSubscription,
  createSubscription,
  getSubscriptionStatus,
} from "../controllers/subscription.controllers.js";
import { handleRazorpayWebhook } from "../controllers/payment.controllers.js";
import  {isLoggedIn}  from "../middleware/isLoggedIn.js";
const router = Router();

router.get("/status/:userId", isLoggedIn, getSubscriptionStatus);
router.post("/create", isLoggedIn, createSubscription);
router.post("/cancel", isLoggedIn, cancelSubscription);
router.post("/webhook", isLoggedIn, handleRazorpayWebhook);
 
export default router;
