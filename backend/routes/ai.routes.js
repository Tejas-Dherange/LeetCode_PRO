import { Router } from "express";
import { getTimeComplexity } from "../controllers/ai.controllers.js";


const router=Router();


router.post("/time-complexity",getTimeComplexity)



export default router;