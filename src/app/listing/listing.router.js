const router = require('express').Router();
const { verifyToken } = require('../utils/verifyUser.js');
const listingCtrl = require("./listing.controller.js");


router.post('/create',verifyToken,listingCtrl.createListing)

router.get('/:id',verifyToken,listingCtrl.getUserListings)
 
module.exports = router;