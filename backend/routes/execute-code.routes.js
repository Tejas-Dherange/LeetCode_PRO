import express from "express";
import {  runCode, submitCode } from "../controllers/execute-code.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router=express.Router();


router.post("/run-code", isLoggedIn, runCode);
router.post("/submit-code", isLoggedIn, submitCode);


export default router;