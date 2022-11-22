import express from 'express'
import { createOrUpdateScore, createScore, updateScore } from '../controllers/scoreController.js'
import {isLogin} from './../Middleware/isLogin.js'

const router = express.Router()

router.post('/score/createOrUpdateScore', createOrUpdateScore)
router.post('/score/createScore', isLogin , createScore)
router.put('/score/updateScore', isLogin , updateScore)

export default router