import express from "express";
import { Router } from "express";
import uploadFile from "../libs/upload.lib.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";


const router = Router();

router.post("/upload", isLoggedIn, uploadFile);

export default router;
