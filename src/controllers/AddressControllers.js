import AddressService from "../services/AddressService";

const getProvinces = async (req,res) => {
    try {
        const data = await AddressService.getProvinces();

        return res.status(200).json(data);
    }catch(e){
        return res.status(500).json({
            message: e.message
        })
    }
}
const getCommune = async(req,res) => {
    try {
        const codeProvince = req.params.code;
        const data = await AddressService.getCommune(codeProvince);
        return res.status(200).json(data);
    } catch(e){
        return res.status(500).json({
            message: e.message
        })
    }
}
module.exports = {
    getProvinces,
    getCommune,
}