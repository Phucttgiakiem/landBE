import CatagoryPtService from "../services/CatagoryPtService.js";
const createCatagoryProperty = async (req, res) => {
    try {
        const {Name,Type} = req.body;
         if(!Name || !Type){
            return res.status(200).json({
                status: "error",
                message: "The input is required"
            });
        }
       const response =  await CatagoryPtService.createCatagoryPt(req.body);
       return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateCatagoryProperty = async (req, res) => {
    try {
        const catagoryPtId = req.params.id;
        // console.log("catagoryPtId: ", catagoryPtId);
        const data = req.body;
        if(!catagoryPtId){
            return res.status(200).json({
                status: "error",
                message: "The catagoryPropertyID is required"
            });
        }
      //  console.log("catagoryPtId: ",req.body);
        const response = await CatagoryPtService.updateCatagoryPt(catagoryPtId, data);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getAllCatagoryProperty = async (req, res) => {
    try {
        const response = await CatagoryPtService.getAllCatagoryPt();
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }    
}
const deleteCatagoryProperty = async (req, res) => {
    try {
        const catagoryPtId = req.params.id;
        if(!catagoryPtId){
            return res.status(200).json({
                status: "error",
                message: "The catagoryPropertyID is required"
            });
        }
        const response = await CatagoryPtService.deleteCatagoryPt(catagoryPtId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllCatagorywithType = async (req,res) => {
    try {
        const typelisting = req.query.typelisting;
        if(!typelisting){
            return res.status(200).json({
                status: "error",
                message: "The field is required"
            });
        }
        const response = await CatagoryPtService.getAllCatagorywithType(typelisting);
        return res.status(200).json(response);
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createCatagoryProperty,
    updateCatagoryProperty,
    getAllCatagoryProperty,
    deleteCatagoryProperty,
    getAllCatagorywithType
}