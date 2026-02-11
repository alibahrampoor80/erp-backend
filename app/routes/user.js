import express from "express";
import {checkLogin} from "../http/middleware/autoLogin.js";
import UserController from "../http/controllers/user.controller.js";


const router = express.Router()

router.get("/profile", checkLogin, UserController.profile)

export {router}
