const authRouter = require('express').Router();
const authCtrl = require("./auth.controller");

//handeled /api/register route
authRouter.use("/register",authCtrl.register);

module.exports = authRouter;