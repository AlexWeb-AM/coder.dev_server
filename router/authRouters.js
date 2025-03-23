import express from 'express'
import { checkOtp, login, logout, register, resetPassword, sendOtp } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/send-otp',sendOtp)
authRouter.post('/check-otp',checkOtp)
authRouter.post('/reset-password',resetPassword)
authRouter.post('/logout',logout)

export default authRouter