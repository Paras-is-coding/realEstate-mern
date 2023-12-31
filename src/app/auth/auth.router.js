const authRouter = require('express').Router();
const authCtrl = require("./auth.controller.js");

//handeled /api/register route
authRouter.post("/sign-up",authCtrl.signUp);
authRouter.post("/sign-in",authCtrl.signIn);
authRouter.post("/google",authCtrl.google);
authRouter.get('/sign-out',authCtrl.signOut);

module.exports = authRouter;