const router = require('express').Router();
const { verifyToken } = require('../utils/verifyUser.js');
const listingCtrl = require("./listing.controller.js");


router.post('/create',verifyToken,listingCtrl.createListing)

router.delete('/delete/:id',verifyToken,listingCtrl.deleteUserListing)

router.post('/update/:id',verifyToken,listingCtrl.updateListing)

router.get('/get/:id',listingCtrl.getListing)

router.get('/get', listingCtrl.getListings);
 
router.get('/:id',verifyToken,listingCtrl.getUserListings)

module.exports = router;