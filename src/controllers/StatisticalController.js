import StatisticalService from "../services/StatisticalService.js";

const StatisticalbyType = async (req,res) => {
    try {
        
        const {limit,page,userId,startDate,endDate,month,quarter,year} = req.query;
       
        const response = await StatisticalService.StatisticalbyType(
            Number(limit) || 8,Number(page) || 1,
            userId,startDate,endDate,month,quarter,year);
        return res.status(200).json(response);
    }
    catch(error){
        return res.status(500).json({
            message: error
        });
    }   
}
const getAllowners = async (req,res) => {
    try {
        const response = await StatisticalService.GetAllOwners();
        return res.status(200).json(response);
    } catch(error){
        return res.status(500).json({
            message:error
        })
    }
}
module.exports = {
    StatisticalbyType,
    getAllowners
}