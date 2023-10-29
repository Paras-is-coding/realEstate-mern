const errorHandler = require('../utils/error.js');
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


    getUserListings = async (req,res,next) =>{
        if(req.user.id === req.params.id){
            try {
                const listings = await Listing.find({userRef:req.params.id});
                res.status(200).json(listings);
            
            } catch (error) {
                next(error)            
            }
        }
        else{
            return next(errorHandler(401,"You can see your own listings only!"));
        }
    }
}

const listingCtrl = new listingController();
module.exports = listingCtrl;