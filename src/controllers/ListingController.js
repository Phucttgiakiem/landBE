import ListingService from "../services/ListingService.js";

const createListing = async(req,res) => {
    try{
        const {Title,Description,Price,numberhouse,CityID,CommuneID,
                horizontal,vertical,front_street,floor,bedroom,bathroom,Toilet,
                Legal,User,CatagoryProperty
        } = req.body;
        if(!Title || !Description || !Price || !numberhouse || !CommuneID || !CityID || !horizontal || !vertical || !front_street || !floor
            || !bedroom || !bathroom || !Toilet || !Legal || !User || !CatagoryProperty
        ) {
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }
        const response = await ListingService.createListing(req.body,req.files);
        return res.status(200).json(response);
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateListing = async (req,res) => {
    try {
        const Listingid = req.params.id;
        const data = req.body;
        if(!Listingid) {
            return res.status(200).json({
                status: "error",
                message: "The listingid is required"
            })
        }
        const response = await ListingService.updateListing(Listingid,data);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const deleteListing = async (req, res) => {
    try {
        const ListingId = req.params.id;
        if(!ListingId){
            return res.status(200).json({
                status: "error",
                message: "The ListingId is required"
            });
        }
        const response = await ListingService.deleteListing(ListingId);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getAllListing = async (req, res) => {
    try {
        const { limit,page,sort,filter} = req.query;
        const response = await ListingService.getAllListing(Number(limit) || 8,Number(page) || 0,sort,filter);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        });
    }
}
const getAllmeListing = async (req,res) => {
    try {
        const { limit,page,sort,filter} = req.query;
        const parsedSort = sort ? JSON.parse(sort) : null;
        const response = await ListingService.getAllListing(Number(limit) || 8,Number(page) || 1,parsedSort,filter);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e.message
        });
    }
}
const getDetailListing = async(req,res) => {
    try {
            const ListingId = req.params.id;
            if(!ListingId){
                return res.status(200).json({
                    status: "error",
                    message: "The ListingId is required"
                });
            }
            const response = await ListingService.getDetailsListing(ListingId);
            console.log(response);
            return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createListing,
    deleteListing,
    getAllListing,
    updateListing,
    getDetailListing,
    getAllmeListing
}