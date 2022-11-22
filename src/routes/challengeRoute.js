import express from "express";
import multer from "multer";
import {
  createChallenge,
  getAllChallenges,
  getChallenge,
  createChallengeParticipant,
  getUserChallenges,
  isParticipant,
  getChallengeStateOfUser,
} from "../controllers/challengeController.js";
import { isLogin } from "../Middleware/isLogin.js";
import { challengeStorage } from "./../Middleware/storageMulter.js";

const router = express.Router();
const upload = multer({ storage: challengeStorage });

//POST
router.post(
  "/challenge/createChallenge",
  upload.single("thumbnail"),
  isLogin,
  createChallenge
);
router.post(
  "/challenge/createChallengeParticipant",
  isLogin,
  createChallengeParticipant
);

//GET
router.get("/challenge/getUserChallenges", isLogin, getUserChallenges);
router.get("/challenge/getChallenges", getAllChallenges);
router.get("/challenge/getChallenge", getChallenge);
router.get("/challenge/isParticipant", isLogin, isParticipant)
router.get("/challenge/getChallengeStateOfUser", isLogin, getChallengeStateOfUser)

export default router;
