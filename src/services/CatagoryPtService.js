import {CatagoryProperty} from "../models/Catagorypropertymodel.js";
import { Listing } from "../models/Listingmodel.js";
import mongoose from "mongoose";
const createCatagoryPt = (newCatagoryPt) => {
    return new Promise(async (resolve, reject) => {
        
        const {name,typePost,friendlyURL,friendlyTypePostURL} = newCatagoryPt;
        try {
            const checkCatagoryPt = await CatagoryProperty.findOne({ Name: name });
            if (checkCatagoryPt !== null) {
                resolve({
                    status: "error",
                    message: "Danh mục đã tồn tại trên hệ thống"
                });
            }
           
            const createdCatagoryPt = await CatagoryProperty.create({
                Name:name,
                NameSlug:friendlyURL,
                Type:typePost,
                TypeSlug:friendlyTypePostURL
            });
            if (createdCatagoryPt) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdCatagoryPt
                });
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
                    status: "error",
                    message: "Danh mục không tìm thấy"
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
            reject(e);
        }
    })
}
const getAllCatagoryforAdmin = (page, limit, filter, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = {};

            // Filter
            if (filter?.Type) {
                query.Type = filter.Type;
            }

            // Sort mặc định
            let sortOption = { createdAt: -1 };

            // Sort từ FE
            if (sort?.field && sort?.order) {
                sortOption = {
                    [sort.field]: sort.order === "ascend" ? 1 : -1
                };
            }

            const skip = (page - 1) * limit;

            const [categories, total] = await Promise.all([
                CatagoryProperty.find(query)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit),
                CatagoryProperty.countDocuments(query)
            ]);

            resolve({
                status: "OK",
                data: categories,
                total,
                currentPage: page,
                totalPage: Math.ceil(total / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};
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
                    status: "error",
                    message: "Không tìm thấy danh mục"
                });
            }
            await Listing.updateMany(
                {
                    CatagoryProperty: new mongoose.Types.ObjectId(id)
                },
                {
                    $set: {
                        CatagoryProperty: null
                    }
                }
            );
            await CatagoryProperty.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Xóa danh mục thành công"
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
    getAllCatagoryforAdmin,
    deleteCatagoryPt,
    getAllCatagorywithType
}