import { Router } from "express";
import {
  editProfile,
  login,
  logout,
  me,
  register,
  setPassword,
  googleCallback,
} from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { upload } from "../libs/upload.lib.js"; // import multer upload
import passport from "../libs/passport.lib.js";

const router = Router();
router.post("/register", register);

router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.get("/me", isLoggedIn, me);

// Use multer middleware for file upload
router.put("/edit-profile", isLoggedIn, upload.single("image"), editProfile);

// Set password for OAuth users
router.post("/set-password", isLoggedIn, setPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, // We're using JWT, not sessions
  }),
  googleCallback,
);

export default router;
