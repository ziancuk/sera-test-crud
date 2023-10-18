import express from "express";
import authController from '../controllers/AuthController.js'

var router = express.Router();

/* GET home page. */
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refreshToken', authController.refreshToken)
router.post('/check-email', authController.checkEmail)

export default router
