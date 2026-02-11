import {verifyToken} from "../../modules/function.js";
import userModel from "../../models/user.js";

function checkRole(requiredRoles) {
    return async (req, res, next) => {
        try {
            const rolesArray = Array.isArray(requiredRoles)
                ? requiredRoles
                : [requiredRoles];

            const authorization = req?.headers?.authorization;
            if (!authorization)
                throw {status: 401, message: "لطفا وارد حساب کاربری خود شوید"};

            let [bearer, token] = authorization.split(" ");

            if (!bearer || bearer.toLowerCase() !== "bearer" || !token)
                throw {status: 401, message: "توکن معتبر نیست"};

            const decoded = verifyToken(token);
            const {username} = decoded;

            const user = await userModel.findOne(
                {username},
                {password: 0, __v: 0}
            );

            if (!user)
                throw {status: 401, message: "لطفا وارد حساب کاربری خود شوید"};

            const hasAccess = user.roles.some((role) =>
                rolesArray.includes(role)
            );

            if (!hasAccess) {
                return res.status(403).json({
                    status: false,
                    message: "شما دسترسی لازم را ندارید",
                    statusCode: 403,
                });
            }

            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    };
}

export {checkRole};
