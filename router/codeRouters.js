import express from 'express'
import { receiveCode } from '../controllers/codeController.js'

const codeRouter = express.Router()

codeRouter.post('/receive-code',receiveCode)

export default codeRouter