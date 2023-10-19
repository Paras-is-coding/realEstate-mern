const router = require('express').Router();

const authRouter = require('../auth/auth.router.js')
const userRouter = require('../user/user.router.js')
const listingRouter = require('../listing/listing.router.js')

router.use('/auth',authRouter);
router.use('/user',userRouter);
router.use('/listing',listingRouter);

module.exports = router;