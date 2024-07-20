import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.post('/register', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser)

// SECURED ROUTES 

router.route("/logout").post(verifyJWT ,logout)

export default router


