import express from 'express';
import { register, login, googleAuth, facebookAuth } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), googleAuth);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook'), facebookAuth);

export default router;

