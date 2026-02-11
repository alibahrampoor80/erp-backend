

import express from 'express'
import authController from "../http/controllers/auth.controller.js";
import {loginValidator, registerValidator} from "../http/validation/auth.js";
import ExpressValidatorMapper from "../http/middleware/checkErrors.js";
const router = express.Router()

router.post('/register', registerValidator(), ExpressValidatorMapper, authController.register)
router.post('/login', loginValidator(), ExpressValidatorMapper, authController.login)

export {router}