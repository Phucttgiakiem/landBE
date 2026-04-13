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

module.exports = {
    getHomePage
};