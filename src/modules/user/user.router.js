import { Router } from 'express'
import * as userController from './controller/user.js'
import { userRoles } from './user.roles.js';
import { myMulter, fileFormat, HME } from './../../services/multer.js';
import { validation } from './../../middleware/validation.js';
import * as userValidators from './user.validation.js'
import auth from '../../middleware/auth.js';

const router = Router();

router.put('/profile/update', validation(userValidators.updateProfile),auth(), userController.updateProfile);
router.patch('/profilePic',myMulter(fileFormat.image).single('image'), HME, auth(), userController.addProfilePic);
router.patch('/password/update', validation(userValidators.updatePassword), auth(), userController.updatePassword);
router.get('/profile/:id', validation(userValidators.getProfile), auth(), userController.getProfile);
router.get('/profile', validation(userValidators.getProfile), auth(), userController.getProfile);
router.get('/signout', auth(), userController.signOut);
router.get('/users', validation(userValidators.getUsers), auth(), userController.getUsers);
router.get('/dashboard', auth(), userController.getDashboard)



export default router
