const authRouter = require('express').Router();
const authCtrl = require("./auth.controller.js");

//handeled /api/register route
authRouter.post("/sign-in",authCtrl.signIn);

module.exports = authRouter;