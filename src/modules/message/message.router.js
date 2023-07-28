import { Router } from 'express'
import auth from '../../middleware/auth.js';
import * as messageController from './controller/message.js'

const router = Router();

router.post('/add/:conversationId', auth(), messageController.sendMessage)


export default router
