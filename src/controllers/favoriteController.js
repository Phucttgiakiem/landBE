import FavoriteService from "../services/FavoriteService";

const createnewfavoriteofuser = async (req,res) => {
    try {
        const Iduser = req.user.id;
        const idListing = req.body.IdListing;
        const response = await FavoriteService.createnewFavoriteofuser(Iduser,idListing);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deletefavoriteofuser = async (req,res) => {
    try {
        const Iduser = req.user.id;
        const idListing = req.params.listingId;
        const response = await FavoriteService.deleteFavoriteofuser(Iduser,idListing);
        return res.status(200).json(response);
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

module.exports = {
    createnewfavoriteofuser,
    deletefavoriteofuser,
}