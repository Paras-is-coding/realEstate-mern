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

    deleteUserListing = async(req,res,next)=>{
        const listing = await Listing.findById(req.params.id)

        if(!listing){
            return next(errorHandler(404,"Listing not found!"))
        }

        if(req.user.id !== listing.userRef){
            return next(errorHandler(401,"You can only delete your own listings!"))
        }

        try {
            await Listing.findByIdAndDelete(req.params.id)       
            res.status(200).json(`Listing ${req.params.id} deleted successfully!`)     
        } catch (error) {
            next(error)
            
        }
    }


   

    updateListing = async (req, res, next) => {
            try {
                const listing = await Listing.findById(req.params.id);
        
                if (!listing) {
                    return next(errorHandler(404, "Listing not found!"));
                }
        
                if (req.user.id !== listing.userRef) {
                    return next(errorHandler(401, "You can update your own listings only!"));
                }
        
                const updatedListing = await Listing.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );
        
                res.status(200).json(updatedListing);
            } catch (error) {
                // Handle the error when the provided ID is not valid
                return next(errorHandler(400, "Invalid ID provided for updating the listing."));
            }
        }
        

        
    }

const listingCtrl = new listingController();
module.exports = listingCtrl;