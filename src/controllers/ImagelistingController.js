import ImagePtService from "../services/ImagePtService";

const getAllImageListing = async(req,res) => {
    try {
        const ListingId = req.params.id;
        if(!ListingId){
            return res.status(200).json({
                status: "error",
                message: "The ListingId is required"
            });
        }
        const response = await ImagePtService.getAllImagewithId(ListingId);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = { 
    getAllImageListing
}