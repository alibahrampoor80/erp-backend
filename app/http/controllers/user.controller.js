import userModel from "../../models/user.js";

class UserController {
    async profile(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id).select("-password -__v -token");

            if (!user) {
                return res.status(404).json({message: "کاربر پیدا نشد!"});
            }

            res.json({
                statusCode: 200,
                data: user
            })
        } catch (error) {
            next(error)
        }
    }

}


export default new UserController();