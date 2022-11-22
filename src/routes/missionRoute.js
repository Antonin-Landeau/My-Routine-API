import express from 'express'
import { createMissions, getMissionChallengerConnected, getMissionsChallenge } from '../controllers/missonController.js';
import { isLogin } from '../Middleware/isLogin.js';

const router = express.Router();

router.post('/mission/createMissions', isLogin, createMissions)
router.get('/mission/getMissionsChallenge', getMissionsChallenge)
router.get('/mission/getMissionChallengerConnected',isLogin, getMissionChallengerConnected)


export default router