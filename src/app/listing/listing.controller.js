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

        getListing = async (req,res,next) =>{
            try {
                const listing = await Listing.findById(req.params.id);
        
                if (!listing) {
                    return next(errorHandler(404, "Listing not found!"));
                } 
                res.status(200).json(listing);
            } catch (error) {
                // Handle the error when the provided ID is not valid
                return next(errorHandler(400, "Invalid ID provided for updating the listing."));
            }
        }



        


        // all search functionality will be in this route
        getListings = async (req,res,next)=>{
            try {
                // getting all the queries from URL of the request

                const limit = parseInt(req.query.limit) ||  9;
                const startIndex = parseInt(req.query.startIndex) || 0;


                // default behaviour of search 
                let offer = req.query.offer;
                if(offer === undefined || offer === 'false'){
                    offer = {$in : [false,true]};
                }

                let furnished = req.query.furnished;
                if(furnished === undefined || furnished === 'false'){
                    furnished = {$in : [false,true]}
                }

                let parking = req.query.parking;
                if(parking === undefined || parking === 'false'){
                    parking = {$in : [false,true]}
                }

                let type = req.query.type;
                if(type === undefined || type === 'all'){
                    type = {$in : ['rent','sale']}
                }
                
                const searchTerm = req.query.searchTerm || ""
                const sort = req.query.sort || "createdAt"
                const order = req.query.order || "desc"


                // we got all our queries NOW we'll get our listings 
                // using $regx on name field and also searching other fields with received value
                const listings = await Listing.find({
                    name:{$regex:searchTerm,$options:'i'},
                    offer,
                    furnished,
                    parking,
                    type,
                }).sort({
                    [sort]:order
                }).limit(limit).skip(startIndex);

               return res.status(200).json(listings)
            } catch (error) {
                next(error)
                
            }
        }


        


        
    }

const listingCtrl = new listingController();
module.exports = listingCtrl;