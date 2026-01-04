import { Router } from "express";
import { getTimeComplexity } from "../controllers/ai.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { rateLimiter } from "../middleware/rateLimiter.middleware.js";


const router=Router();


router.post("/time-complexity", isLoggedIn, rateLimiter, getTimeComplexity)



export default router;