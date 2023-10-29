const router = require('express').Router();
const { verifyToken } = require('../utils/verifyUser.js');
const listingCtrl = require("./listing.controller.js");


router.post('/create',verifyToken,listingCtrl.createListing)

router.get('/:id',verifyToken,listingCtrl.getUserListings)

router.delete('/delete/:id',verifyToken,listingCtrl.deleteUserListing)

router.post('/update/:id',verifyToken,listingCtrl.updateListing)
 
module.exports = router;