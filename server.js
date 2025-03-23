import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './router/authRouters.js'
import codeRouter from './router/codeRouters.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: 'https://code-dev-mu.vercel.app', 
    credentials: true
}));
app.use(express.json())
app.use('/api/auth',authRouter)
app.use('/api/code',codeRouter)


app.listen(process.env.PORT,() => {console.log('Server Runned :)')})