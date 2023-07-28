import { Router } from 'express'
import auth from '../../middleware/auth.js';
import * as conversationController from './controller/conversation.js'
import * as messageController from '../message/controller/message.js'

const router = Router();

router.post('/add', auth(), conversationController.addConversation )
router.get('/user/chats', auth(), conversationController.getUserChats)
router.get('/chat/:friendId', auth(), conversationController.getSpecificChat)
router.get('/:conversationId/messages', auth(), messageController.getMessages)
router.get('/recent', auth(), conversationController.getRecentChats)

export default router
