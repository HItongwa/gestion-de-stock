import express from 'express'
import { loginAPI, validateLogin } from '../controllers/AuthController.js'
const router = express.Router()
router.post('/login', validateLogin, loginAPI)
export default router
