const router = require('express').Router();

const authRouter = require('../auth/auth.router.js')
const userRouter = require('../user/user.router.js')

router.use('/auth',authRouter);
router.use('/user',userRouter);

module.exports = router;