import { Router } from "express";
import { editProfile, login, logout, me, register } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { upload } from "../libs/upload.lib.js"; // import multer upload

const router = Router();
router.post("/register",register);

router.post("/login", login);
router.get("/logout",isLoggedIn, logout);
router.get("/me",isLoggedIn, me);

// Use multer middleware for file upload
router.put("/edit-profile", isLoggedIn, upload.single("image"), editProfile);

export default router;