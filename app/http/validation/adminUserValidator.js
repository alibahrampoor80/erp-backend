import {body} from "express-validator";
import userModel from "../../models/user.js";

function adminCreateUserValidator() {
    return [
        body("username")
            .notEmpty().withMessage("نام کاربری نمیتواند خالی باشد")
            .custom(async (value) => {
                const UsernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
                if (!UsernameRegex.test(value)) throw "نام کاربری صحیح نمیباشد";

                const user = await userModel.findOne({username: value});
                if (user) throw "نام کاربری تکراری میباشد";
                return true;
            }),

        body("email")
            .optional()
            .isEmail().withMessage("ایمیل صحیح نمیباشد")
            .custom(async (email) => {
                const user = await userModel.findOne({email});
                if (user) throw "ایمیل تکراری میباشد";
                return true;
            }),


        body("mobile")
            .notEmpty().withMessage("شماره موبایل نمیتواند خالی باشد")
            .isMobilePhone("fa-IR").withMessage("شماره موبایل صحیح نمیباشد")
            .custom(async (mobile) => {
                const user = await userModel.findOne({mobile});
                if (user) throw "موبایل تکراری میباشد";
                return true;
            }),


        body("password")
            .notEmpty().withMessage("رمز عبور نمیتواند خالی باشد")
            .isLength({min: 6, max: 16}).withMessage("رمز عبور باید ۶ تا ۱۶ نویسه باشد"),

        body("roles")
            .optional()
            .isArray().withMessage("باید یک آرایه از نقش‌ها باشد")
            .custom((roles) => {
                const validRoles = ["USER", "ADMIN"];
                for (const r of roles) {
                    if (!validRoles.includes(r)) throw "نقش معتبر نیست";
                }
                return true;
            }),

        body("first_name").optional().isString().withMessage("نام باید رشته باشد"),
        body("last_name").optional().isString().withMessage("نام خانوادگی باید رشته باشد"),
        body("profile_image").optional().isString().withMessage("تصویر پروفایل باید رشته باشد"),
        body("skills").optional().isArray().withMessage("مهارت‌ها باید آرایه باشند"),
        body("age").optional().isNumeric().withMessage("سن باید عدد باشد"),
        body("national_code").optional().isString().withMessage("کد ملی باید رشته باشد"),
        body("birth_date").optional().isISO8601().withMessage("تاریخ تولد معتبر نیست"),
        body("education_degree").optional().isString().withMessage("مدرک تحصیلی باید رشته باشد"),
        body("field_of_study").optional().isString().withMessage("رشته تحصیلی باید رشته باشد"),
        body("marital_status")
            .optional()
            .isIn(["single", "married", "divorced"])
            .withMessage("وضعیت تاهل معتبر نیست"),
        body("number_of_children").optional().isInt({min: 0}).withMessage("تعداد فرزندان باید عدد باشد"),
        body("work_experience_years").optional().isInt({min: 0}).withMessage("سابقه کار باید عدد باشد"),
        body("insurance_experience_years").optional().isInt({min: 0}).withMessage("سابقه بیمه باید عدد باشد"),


    ];
}

function adminUpdateUserValidator() {
    return [

        body("username")
            .optional()
            .custom(async (value, {req}) => {
                const UsernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
                if (!UsernameRegex.test(value)) throw "نام کاربری صحیح نمیباشد";

                const user = await userModel.findOne({
                    username: value,
                    _id: {$ne: req.params.id}
                });
                if (user) throw "نام کاربری تکراری میباشد";
                return true;
            }),

        body("email")
            .optional()
            .isEmail().withMessage("ایمیل صحیح نمیباشد")
            .custom(async (email, {req}) => {
                const user = await userModel.findOne({
                    email,
                    _id: {$ne: req.params.id}
                });
                if (user) throw "ایمیل تکراری میباشد";
                return true;
            }),

        body("mobile")
            .optional()
            .isMobilePhone("fa-IR").withMessage("شماره موبایل صحیح نمیباشد")
            .custom(async (mobile, {req}) => {
                const user = await userModel.findOne({
                    mobile,
                    _id: {$ne: req.params.id}
                });
                if (user) throw "شماره موبایل تکراری است";
                return true;
            }),

        body("password")
            .optional()
            .isLength({min: 6, max: 16})
            .withMessage("رمز عبور باید بین ۶ تا ۱۶ نویسه باشد"),

        body("roles")
            .optional()
            .isArray().withMessage("نقش‌ها باید آرایه باشند"),

        body("first_name").optional().isString(),
        body("last_name").optional().isString(),
        body("profile_image").optional().isString(),
        body("skills").optional().isArray(),
        body("age").optional().isNumeric(),
        body("national_code").optional().isString(),
        body("birth_date").optional().isISO8601(),
        body("education_degree").optional().isString(),
        body("field_of_study").optional().isString(),
        body("marital_status")
            .optional()
            .isIn(["single", "married", "divorced"]),
        body("number_of_children").optional().isInt({min: 0}),
        body("work_experience_years").optional().isInt({min: 0}),
        body("insurance_experience_years").optional().isInt({min: 0}),
    ];
}

export {adminCreateUserValidator, adminUpdateUserValidator}
