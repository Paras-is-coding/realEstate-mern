const authRouter = require('express').Router();
const authCtrl = require("./auth.controller.js");

//handeled /api/register route
authRouter.post("/sign-up",authCtrl.signUp);

module.exports = authRouter;