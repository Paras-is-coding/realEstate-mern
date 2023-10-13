const userRouter = require('express').Router();
const userCtrl = require("./user.controller.js");
const {verifyToken} = require('../utils/verifyUser.js')

userRouter.post("/update/:id",verifyToken,userCtrl.updateUser)

module.exports = userRouter