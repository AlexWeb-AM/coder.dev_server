import express from 'express'
import { receiveCode } from '../utils/codeController.js'

const codeRouter = express.Router()

codeRouter.post('/receive-code',receiveCode)

export default codeRouter