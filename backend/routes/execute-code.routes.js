import express from "express";
import { executeCode } from "../controllers/execute-code.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router=express.Router();


router.post("/execute",isLoggedIn,executeCode);


export default router;