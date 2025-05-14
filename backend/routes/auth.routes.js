import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = Router();
router.post("/register",register);

router.post("/login", login);
router.get("/logout",isLoggedIn, logout);
router.get("/me",isLoggedIn, me);
export default router;
