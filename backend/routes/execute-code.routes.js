import express from "express";
import { executeCode } from "../controllers/execute-code.controllers.js";

const router=express.Router();


router.post("/execute",executeCode);


export default router;