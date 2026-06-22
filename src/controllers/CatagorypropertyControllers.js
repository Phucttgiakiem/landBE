import CatagoryPtService from "../services/CatagoryPtService.js";
const createCatagoryProperty = async (req, res) => {
    try {
        const {name,typePost,friendlyURL,friendlyTypePostURL} = req.body;
         if(!name || !typePost || !friendlyURL || !friendlyTypePostURL){
            return res.status(400).json({
                status: "error",
                message: "The input is required"
            });
        }
       const response =  await CatagoryPtService.createCatagoryPt(req.body);
       if(response.status === "error"){
            return res.status(400).json(response);
       }
       return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const updateCatagoryProperty = async (req, res) => {
    try {
        const catagoryPtId = req.params.id;
        const data = req.body;
        if(!catagoryPtId){
            return res.status(400).json({
                status: "error",
                message: "The catagoryPropertyID is required"
            });
        }
        const response = await CatagoryPtService.updateCatagoryPt(catagoryPtId, data);
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
            return res.status(400).json({
                status: "error",
                message: "The catagoryPropertyID is required"
            });
        }
        const response = await CatagoryPtService.deleteCatagoryPt(catagoryPtId);
        if(response.status === "error"){
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
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
const getAllCatagoryforAdmin = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;

        const response = await CatagoryPtService.getAllCatagoryforAdmin(
            Number(page) || 1,
            Number(limit) || 4,
            filter ? JSON.parse(filter) : {},
            sort ? JSON.parse(sort) : {}
        );

        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};
module.exports = {
    createCatagoryProperty,
    updateCatagoryProperty,
    getAllCatagoryProperty,
    deleteCatagoryProperty,
    getAllCatagorywithType,
    getAllCatagoryforAdmin
}