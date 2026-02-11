import userModel from "../../models/user.js";
import {hashPassword} from "../../modules/function.js";

class AdminController {
    async create(req, res, next) {
        try {
            const {
                username,
                email,
                mobile,
                password,
                roles,
                first_name,
                last_name,
                profile_image,
                skills,
                age,
                national_code,
                birth_date,
                education_degree,
                field_of_study,
                marital_status,
                number_of_children,
                work_experience_years,
                insurance_experience_years,
            } = req.body;
            const hashedPassword = hashPassword(password)

            const userData = {
                username,
                email,
                mobile,
                password: hashedPassword,
                roles: Array.isArray(roles) && roles.length ? roles : ["USER"],
            };

            if (first_name !== undefined) userData.first_name = first_name;
            if (last_name !== undefined) userData.last_name = last_name;
            if (profile_image !== undefined) userData.profile_image = profile_image;
            if (skills !== undefined) userData.skills = Array.isArray(skills) ? skills : [];
            if (age !== undefined) userData.age = Number(age);
            if (national_code !== undefined) userData.national_code = national_code;
            if (birth_date !== undefined) userData.birth_date = new Date(birth_date);
            if (education_degree !== undefined) userData.education_degree = education_degree;
            if (field_of_study !== undefined) userData.field_of_study = field_of_study;
            if (marital_status !== undefined) userData.marital_status = marital_status;
            if (number_of_children !== undefined) userData.number_of_children = Number(number_of_children);
            if (work_experience_years !== undefined) userData.work_experience_years = Number(work_experience_years);
            if (insurance_experience_years !== undefined) userData.insurance_experience_years = Number(insurance_experience_years);

            const user = await userModel.create(userData);

            const userToReturn = user.toObject();
            delete userToReturn.password;

            return res.json({
                status: true,
                message: "کاربر با موفقیت ایجاد شد",
                data: userToReturn,
            });


        } catch (err) {
            res.status(500).json({
                status: false,
                message: "خطا در ایجاد کاربر",
                error: err.message,
            });
        }
    }

    async update(req, res, next) {
        try {
            const userId = req.params.id;

            const existingUser = await userModel.findById(userId);
            if (!existingUser) {
                return res.status(404).json({
                    status: false,
                    message: "کاربر یافت نشد"
                });
            }

            const {
                username,
                email,
                mobile,
                password,
                roles,
                first_name,
                last_name,
                profile_image,
                skills,
                age,
                national_code,
                birth_date,
                education_degree,
                field_of_study,
                marital_status,
                number_of_children,
                work_experience_years,
                insurance_experience_years,
            } = req.body;

            const updateData = {};


            if (username !== undefined) {
                const exists = await userModel.findOne({username, _id: {$ne: userId}});
                if (exists) return res.status(400).json({status: false, message: "نام کاربری تکراری است"});
                updateData.username = username;
            }

            if (email !== undefined) {
                const exists = await userModel.findOne({email, _id: {$ne: userId}});
                if (exists) return res.status(400).json({status: false, message: "ایمیل تکراری است"});
                updateData.email = email;
            }

            if (mobile !== undefined) {
                const exists = await userModel.findOne({mobile, _id: {$ne: userId}});
                if (exists) return res.status(400).json({status: false, message: "شماره موبایل تکراری است"});
                updateData.mobile = mobile;
            }

            if (password !== undefined && password.trim()) {
                updateData.password = hashPassword(password);
            }

            if (roles !== undefined) {
                updateData.roles = Array.isArray(roles) && roles.length ? roles : ["USER"];
            }


            if (first_name !== undefined) updateData.first_name = first_name;
            if (last_name !== undefined) updateData.last_name = last_name;
            if (profile_image !== undefined) updateData.profile_image = profile_image;
            if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : [];
            if (age !== undefined) updateData.age = Number(age);
            if (national_code !== undefined) updateData.national_code = national_code;
            if (birth_date !== undefined) updateData.birth_date = new Date(birth_date);
            if (education_degree !== undefined) updateData.education_degree = education_degree;
            if (field_of_study !== undefined) updateData.field_of_study = field_of_study;
            if (marital_status !== undefined) updateData.marital_status = marital_status;
            if (number_of_children !== undefined) updateData.number_of_children = Number(number_of_children);
            if (work_experience_years !== undefined) updateData.work_experience_years = Number(work_experience_years);
            if (insurance_experience_years !== undefined) updateData.insurance_experience_years = Number(insurance_experience_years);

            const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            });

            const userToReturn = updatedUser.toObject();
            delete userToReturn.password;

            return res.json({
                status: true,
                message: "کاربر با موفقیت ویرایش شد",
                data: userToReturn,
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: "خطا در ویرایش کاربر",
                error: err.message,
            });
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;

            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "کاربر یافت نشد",
                });
            }

            await userModel.deleteOne({_id: id});

            res.json({
                status: true,
                message: "کاربر با موفقیت حذف شد",
            });

        } catch (err) {
            next(err);
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;

            const user = await userModel.findById(id, {password: 0, __v: 0});

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "کاربر یافت نشد",
                });
            }

            res.json({
                status: true,
                data: user,
            });

        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            let {page = 1, limit = 10} = req.query;

            page = Number(page);
            limit = Number(limit);

            const skip = (page - 1) * limit;

            const total = await userModel.countDocuments();

            const users = await userModel
                .find({}, {password: 0, __v: 0})
                .skip(skip)
                .limit(limit)
                .sort({createdAt: -1});

            res.json({
                status: true,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                data: users
            });

        } catch (err) {
            next(err);
        }
    }


}

export default new AdminController();