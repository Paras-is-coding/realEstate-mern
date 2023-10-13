const errorHandler = require("../utils/error");
const bcryptjs = require('bcryptjs');
const User = require('../auth/authModels/user.model.js');

class UserController {
    async updateUser(req, res, next) {
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, "You can only update your own account"));
        }

        try {
            if (req.body.password) {
                req.body.password = bcryptjs.hashSync(req.body.password, 10);
            }

            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            }, { new: true });

            if (!updateUser) {
                return next(errorHandler(404, "User not found"));
            }

            const { password, ...rest } = updateUser._doc;

            res.status(200).json(rest);
        } catch (error) {
            next(error); // Use 'next' to pass the error to Express error handling middleware
        }
    }
}

const userCtrl = new UserController();

module.exports = userCtrl;
