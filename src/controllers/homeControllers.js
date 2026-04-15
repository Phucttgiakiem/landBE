import HomeService from "../services/HomeService.js";
let getHomePage = async(req, res) => {
    try {
        const response = await HomeService.getAllHome();
        return res.status(200).json(response);
    }
    catch(e){
        console.error("Error in getHomePage:", e);
        return res.status(404).json({
            message: e
        })
    }
}
let getListingRelated = async (req,res) => {
    try {
        const {limit,page,CommuneID,CityID} = req.query;
        if(!limit || !page || !CommuneID || !CityID){
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }
        const response = await HomeService.getAllListingRelated(limit,page,CommuneID,CityID);
        return res.status(200).json(response);
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports = {
    getHomePage,
    getListingRelated
};