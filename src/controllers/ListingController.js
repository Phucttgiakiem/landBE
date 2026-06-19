import ListingService from "../services/ListingService.js";

const createListing = async(req,res) => {
    try{
        const {Title,Description,Price,numberhouse,City,Commune,
                horizontal,vertical,front_street,floor,bedroom,bathroom,Toilet,
                Legal,User,CatagoryProperty, Type
        } = req.body;
        if(!Title || !Description || !Price || !numberhouse || !Commune || !City || !horizontal || !vertical || !front_street || !floor
            || !bedroom || !bathroom || !Toilet || !Legal || !User || !CatagoryProperty || !Type
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
        let data = req.body;
        if(!Listingid) {
            return res.status(400).json({
                status: "error",
                message: "mã bài đăng không được bỏ qua"
            })
        }
        const response = await ListingService.updateListing(Listingid,data,req.files);
        if(response.status === "error"){
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}
const deleteListing = async (req, res) => {
    try {
        const {arrid,typedelete} = req.body;
        console.log(req.body);
        if(arrid.length === 0){
            return res.status(400).json({
                status: "error",
                message: "The arrayId is required"
            });
        }
        if(typedelete === "soft"){
            const response = await ListingService.softDeleteListing(arrid);
            return res.status(200).json(response);
        }
        const response = await ListingService.deleteListing(arrid);
        return res.status(200).json(response);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: e
        })
    }
}
const restoreListing = async (req,res) => {
    try {
        const arrid = req.body;
        if(arrid.length === 0){
            return res.status(200).json({
                status: "error",
                message: "The arrayId is required"
            });
        }
        const response = await ListingService.restoreListing(arrid);
        return res.status(200).json(response);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: e
        })
    }
}
const getAllListingDeleted = async (req, res) => {
    try {
        const {limit,page,sort} = req.query;
        const User = req.user.id;
        const parsedSort = sort ? JSON.parse(sort) : null;
        const response = await ListingService.getAllListingDeleted(Number(limit) || 8,Number(page) || 0,parsedSort,User);
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        });
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
                return res.status(400).json({
                    status: "error",
                    message: "The ListingId is required"
                });
            }
            const response = await ListingService.getDetailsListing(ListingId);
            return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
            message: e
        })
    }
}
const getTitleproperty = async( req,res) => {
    try {
        
        const {limit,keyword,typeproperty} = req.query;
        console.log(req.query);
        const response = await ListingService.getTitleproperty(Number(limit) || 8,keyword,typeproperty);
        return res.status(200).json(response);
    }catch(e){
        return res.status(500).json({
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
    getAllmeListing,
    getAllListingDeleted,
    restoreListing,
    getTitleproperty,
    
}