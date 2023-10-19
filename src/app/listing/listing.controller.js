const Listing = require('./listing.model.js');

class listingController {
    createListing = async(req,res,next)=>{
        try {
            const listing = await Listing.create(req.body)
            return res.status(201).json(listing)
            
        } catch (error) {
            next(error)
        }
    }
}

const listingCtrl = new listingController();
module.exports = listingCtrl;