import express from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Google Login
router.post("/google", googleLogin);

export default router;