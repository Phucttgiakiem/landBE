import DashboardService from "../services/DashboardService";

const getAdminOverview = async (req,res) => {
    try {
        const response = await DashboardService.getAdminOverview();
        return res.status(200).json(response);
    } catch(e){
        res.status(404).json({
            message: e
        })
    }
}
const getSellerOverview = async (req,res) => {
    try {
        const iduser = req.query.iduser;
        const response = await DashboardService.getSellerOverview(iduser);
        return res.status(200).json(response);
    } catch(e){
        res.status(404).json({
            message:e
        })
    }
}
const getUserOverview = async( req, res ) => {
    try {
        const iduser = req.query.iduser;
        const response = await DashboardService.getUserOverview(iduser);
        return res.status(200).json(response);
    } catch(e){
        res.status(404).json({
            message:e
        })
    }
}
module.exports = {
    getAdminOverview,
    getSellerOverview,
    getUserOverview,
}