import mongoose from "mongoose";
import { favorite } from "../models/favoritemodel";
import { Listing } from "../models/Listingmodel";
const getFavoritelistofuser = (iduser) => {
    return new Promise(async(resolve,reject) => {
        try {
            const favoritelist = await favorite.find({userId : iduser}).select("listingId");
            resolve (favoritelist);
        }catch(err){
            reject(err);
        }
    })
}
const getCountFavoriteofAllproperty = (arrId) => {
    return new Promise(async(resolve,reject) => {
        try {
            const totalLikes = await favorite.countDocuments({
                listingId: { $in: arrId }
            });
            resolve(totalLikes);
        }catch(err){
            reject(err);
        }
    })
}
const createnewFavoriteofuser = (iduser,idListing) => {
    return new Promise(async(resolve,reject) => {
        try {
            const checkproperty = await Listing.findById(idListing);
            if(checkproperty){
                await favorite.create({
                    listingId:checkproperty._id,
                    userId:iduser
                })
                resolve(
                    {
                        status: "OK",
                        message: "SUCCESS",
                    }
                );
            }
            resolve({
                status: "OK",
                message: "Cannot found property",
            })
        }catch(err){
            console.log("err: ",err);
            reject(err);
        }
    })
}
const deleteFavoriteofuser = (iduser,idListing) => {
    return new Promise (async(resolve,reject) => {
        try {
            const checkproperty = await Listing.findById(idListing);
            if(checkproperty){
                await favorite.deleteOne({
                    listingId:checkproperty._id,
                    userId:iduser
                })
                resolve(
                    {
                        status: "OK",
                        message: "SUCCESS",
                    }
                );
            }
         resolve({
                status: "OK",
                message: "Cannot found property",
            })
        }catch(err){
            console.log("err: ",err);
            reject(err);
        }
    })
}
module.exports={
    getFavoritelistofuser,
    createnewFavoriteofuser,
    deleteFavoriteofuser,
    getCountFavoriteofAllproperty,
}