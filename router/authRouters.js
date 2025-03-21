import express from 'express'
import { checkOtp, login, register, sendOtp } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/send-otp',sendOtp)
authRouter.post('/check-otp',checkOtp)
export default authRouter