import { Router } from 'express'
import auth from '../../middleware/auth.js';
import * as groupController from './controller/group.js'

const router = Router();

router.post('/add', auth(), groupController.createGroup)
router.get('/user/groups', auth(), groupController.getUserGroups)
router.get('/all', auth(), groupController.getAllGroups)
router.get('/:groupId/messages', auth(),groupController.getGroupMessages)
router.patch('/join', auth(), groupController.joinGroup)


export default router
