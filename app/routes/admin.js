import express from "express";
import {checkRole} from "../http/middleware/checkAdmin.js";
import {adminCreateUserValidator, adminUpdateUserValidator} from "../http/validation/adminUserValidator.js";
import AdminController from "../http/controllers/admin.controller.js";
import ExpressValidatorMapper from "../http/middleware/checkErrors.js";


const router = express.Router()

router.get("/all-users", checkRole(["ADMIN"]), AdminController.getAll)

router.get("/one-user/:id", checkRole(["ADMIN"]), AdminController.getOne)

router.post("/create-user", checkRole(["ADMIN"]), adminCreateUserValidator(),
    ExpressValidatorMapper, AdminController.create)

router.put("/update-user/:id", checkRole(["ADMIN"]), adminUpdateUserValidator(),
    ExpressValidatorMapper, AdminController.update)

router.delete("/delete-user/:id", checkRole(["ADMIN"]), AdminController.delete)


export {router}