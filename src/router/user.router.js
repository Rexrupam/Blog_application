import {Router} from "express"
import { healthCheck, signup, login, logout, resetPassword } from "../controller/user.controller.js";
import { verifyIdToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/signup').post(signup)
router.route('/healthCheck').get(healthCheck)
router.route('/login').post(login)
router.route('/resetPassword').post(verifyIdToken,resetPassword)
router.route('/logout').post(verifyIdToken,logout)

export default router;

