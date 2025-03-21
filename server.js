import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './router/authRouters.js'

dotenv.config()

const app = express()

app.use(cors({credentials: true,origin:'*'}))
app.use(express.json())
app.use('/api/auth',authRouter)

app.listen(process.env.PORT,() => {console.log('Server Runned :)')})