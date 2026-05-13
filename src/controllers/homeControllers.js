import HomeService from "../services/HomeService.js";
let getHomePage = async(req, res) => {
    try {
        const Iduser = req.user?.id || null
        const response = await HomeService.getAllHome(Iduser);
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
let getListingFilter = async (req,res) => {
    try {
        const {limit,page,sort} = req.query;
        const filters = {};
        Object.keys(req.query).forEach((key) => {
            if (key.startsWith("filter[")) {
                const parts = key.match(/\[([^\]]+)\]/g).map(s => s.slice(1, -1));

                let current = filters;

                parts.forEach((part, index) => {
                    if (index === parts.length - 1) {
                        current[part] = req.query[key];
                    } else {
                        if (!current[part]) current[part] = {};
                        current = current[part];
                    }
                });
            }
        });
        const response = await HomeService.getListingFillter(Number(limit) || 8,Number(page) || 0,sort,filters);
            return res.status(200).json(response);
    } catch(e){
        console.log(e);
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    getHomePage,
    getListingRelated,
    getListingFilter
};