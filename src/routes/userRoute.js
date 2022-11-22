import express from "express";
import {
  getUserInfos,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { isValidRegistration } from "../Middleware/isValidRegistration.js";
import { isValidAuthentification } from "../Middleware/isValidAuthentification.js";
import { isLogin } from "../Middleware/isLogin.js";
import { userStorage } from "./../Middleware/storageMulter.js";

import multer from "multer";

const router = express.Router();

const upload = multer({ storage: userStorage });

router.post(
  "/user/register",
  upload.single("avatar"),
  isValidRegistration,
  registerUser
);
router.post("/user/login", isValidAuthentification, loginUser);
router.get("/user/getUserInfos", isLogin, getUserInfos);

export default router;
