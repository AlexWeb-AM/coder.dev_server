import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRouter from './router/authRouters.js'
import codeRouter from './router/codeRouters.js'



const app = express()

app.use(cors({
    origin:'*', 
    credentials: true
}));
app.use(express.json())
app.use('/api/auth',authRouter)
app.use('/api/code',codeRouter)


app.listen(process.env.PORT,() => {console.log('Server Runned :)')})