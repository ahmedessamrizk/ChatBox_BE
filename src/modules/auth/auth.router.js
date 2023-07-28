import { Router } from 'express'
import * as authController from './controller/auth.js'
import passport from 'passport';
import * as authValidators from './auth.validation.js'
import { validation } from './../../middleware/validation.js';


const router = Router();

router.post('/signup', validation(authValidators.signUp), authController.signUp);
router.get('/confirmEmail/:token', validation(authValidators.confirmEmail), authController.confirmEmail);
router.post('/signin', validation(authValidators.signIn), authController.signIn);
router.post('/sendcode', validation(authValidators.sendCode), authController.sendCode);
router.post('/password/recover', validation(authValidators.recoverPassword), authController.recoverPassword);

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/fail', authController.googleFail);
router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/fail' }), authController.googleSign)

export default router