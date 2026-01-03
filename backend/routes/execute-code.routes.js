import express from "express";
import {  runCode, submitCode } from "../controllers/execute-code.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { rateLimiter } from "../middleware/rateLimiter.middleware.js";

const router=express.Router();


router.post("/run-code", isLoggedIn, rateLimiter, runCode);
router.post("/submit-code", isLoggedIn, rateLimiter, submitCode);


export default router;