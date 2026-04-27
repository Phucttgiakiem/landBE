import {CatagoryProperty} from "../models/Catagorypropertymodel.js";


const createCatagoryPt = (newCatagoryPt) => {
    return new Promise(async (resolve, reject) => {
        
        const { Name,Type } = newCatagoryPt;
        try {
            const checkCatagoryPt = await CatagoryProperty.findOne({ Name: Name });
            if (checkCatagoryPt !== null) {
                resolve({
                    status: "OK",
                    message: "the CatagoryProduct already exists"
                });
            }
           
            const createdCatagoryPt = await CatagoryProperty.create({
                Name,
                Type
            });
            if (createdCatagoryPt) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdCatagoryPt}
                );
            }
        } catch (e) {
            reject(e);
        }
    })
}
const updateCatagoryPt = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
           
            const checkCatagoryPt = await CatagoryProperty.findOne({ _id: id });
            if(checkCatagoryPt === null) {
                resolve({
                    status: "OK",
                    message: "the CatagoryProperty is not defined"
                });
            }
            const updatedCatagory_pt = await CatagoryProperty.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedCatagory_pt
            });
        } catch (e) {
            reject(e);
        }
    })
}
const getAllCatagoryPt = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCatagoryPt = await CatagoryProperty.aggregate([
                {
                    $group: {
                        _id: "$Type",
                        TypeSlug: { $first: "$TypeSlug" },
                        items: {$push: "$$ROOT"}
                    }
                },
                {
                    $sort: { _id: -1 } 
                }
            ]);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allCatagoryPt
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}
const getAllCatagorywithType = (typeListing) => {
    return new Promise(async (resolve,reject) => {
        try {
            const list = await CatagoryProperty.find({TypeSlug:typeListing});
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: list
            })
        } catch(e){
            reject(e);
        }
    })
}
const deleteCatagoryPt = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCatagoryPt = await CatagoryProperty.findOne({ _id: id });
            if(checkCatagoryPt === null) {
                resolve({
                    status: "OK",
                    message: "the CatagoryProperty is not defined"
                });
            }
            await CatagoryProperty.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete CatagoryProperty success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createCatagoryPt,
    updateCatagoryPt,
    getAllCatagoryPt,
    deleteCatagoryPt,
    getAllCatagorywithType
}