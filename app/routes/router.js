import express from 'express'
import {router as authRoutes} from "./auth.js";
import {router as adminRoutes} from "./admin.js";
import {router as userRoutes} from "./user.js";

const allRoutes = express.Router()

allRoutes.use('/auth', authRoutes)
allRoutes.use('/admin', adminRoutes)
allRoutes.use("/user", userRoutes)

// router.use('/user', userRoutes)

export default allRoutes