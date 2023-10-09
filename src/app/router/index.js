const router = require('express').Router();

const authRouter = require('../auth/auth.router.js')

router.use('/auth',authRouter);

module.exports = router;