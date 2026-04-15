import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js"
import ImagePtService from "../services/ImagePtService.js";
const createListing = (data,files) => {
    return new Promise(async (resolve, reject) => {
         const {Title,Description,Price,numberhouse,Commune,City,
                horizontal,vertical,front_street,floor,bedroom,bathroom,Toilet,
                Legal,User,CatagoryProperty,Type
        } = data;
        try {
            let commune = Commune.split('-');
            let city = City.split('-');
            const createListing = await Listing.create({
                Title: Title,
                Description: Description,
                Price: Price,
                Address: {
                    numberhouse: numberhouse,
                    Commune: {
                        id: commune[0],
                        name: commune[1]
                    },
                    City: {
                        id: city[0],
                        name: city[1]
                    },
                },
                horizontal: horizontal,
                vertical: vertical,
                front_street:front_street,
                floor:floor,
                bedroom:bedroom,
                bathroom:bathroom,
                Toilet:Toilet,
                Legal:Legal,
                approval_status: "chưa xác thực",
                visibility_status: "công khai",
                User:User,
                CatagoryProperty:CatagoryProperty,
                type: Type

            });
            if (files && files.length > 0) {
                await ImagePtService.createImagePtmultip(files, createListing._id);
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

const updateListing = (id,data,files) => {
    return new Promise(async (resolve,reject) => {
        try{
            const checkListing = await Listing.findOne({ _id:id});
            if(checkListing === null){
                resolve({
                    status: "OK",
                    message: "the listing is not defined"
                })
            }
            // when update listing, any field another initial field, the field will be update
            const listingObj = checkListing.toObject();
            const updateData = {};
           Object.keys(listingObj).forEach((field) => {
                if (
                    data[field] !== undefined &&
                    listingObj[field] !== data[field]
                ) {
                    updateData[field] = data[field];
                }
            });
            const updateListing = await Listing.findByIdAndUpdate(id,updateData,{new:true});
            // update image listing
            if(files && files.length > 0){
                await ImagePtService.createImagePtmultip(files, id);
            }

            const removedImages = JSON.parse(data.removedImages)
            if(removedImages && removedImages.length > 0){
                await ImagePtService.deleteImagewithId(removedImages);
            }
             resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateListing
            });
        }catch(e){
            reject(e);
        }
    })
}
const deleteListing = (arrid) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Listing.deleteMany({_id: {$in: arrid}});
            await ImagePtService.deleteAllImagewithId(arrid);
            resolve({
                status: "OK",
                message: "Delete array listing success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
const softDeleteListing = (arrId) => {
    return new Promise(async (resolve, reject) => {
        try {
           // console.log(arrId);
            await Listing.updateMany(
                {_id:{ $in: arrId }},
                {$set: {
                    isDeleted: true,
                    deletedAt: new Date()
                }}
            );
            resolve({
                status: "OK",
                message: "Soft delete listing success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
const restoreListing = (arrId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Listing.updateMany(
                {_id:{ $in: arrId }},
                {$set: {
                    isDeleted: false,
                    deletedAt: new Date(0)
                }}
            );  
            resolve({
                status: "OK",
                message: "Restore listing success"
            });
        } catch (e) {
            reject(e);
        }   
    });
}
const buildQuery = (filters) => {
    const query = {};

    if (!filters) return query;

    filters = JSON.parse(filters);
    Object.keys(filters).forEach((field) => {
        if (field === "keyword") return;
        let value = filters[field];

        // Bỏ qua null hoặc undefined
        if (value === null || value === undefined || value === "") return;

        // Nếu là ObjectId field
        if (["User", "CatagoryProperty"].includes(field)) {
            // if (mongoose.Types.ObjectId.isValid(value)) {
                query[field] = new mongoose.Types.ObjectId(value);
            // }
            return;
        }

        // Nếu là object (range, regex...)
        if (typeof value === "object" && !Array.isArray(value)) {

            const operators = {};

            Object.keys(value).forEach((operator) => {
                if (value[operator] === null || value[operator] === undefined) return;

                switch (operator) {
                    case "gte":
                        operators.$gte = value[operator];
                        break;
                    case "lte":
                        operators.$lte = value[operator];
                        break;
                    case "gt":
                        operators.$gt = value[operator];
                        break;
                    case "lt":
                        operators.$lt = value[operator];
                        break;
                    case "regex":
                        operators.$regex = value[operator];
                        operators.$options = "i";
                        break;
                }
            });

            if (Object.keys(operators).length > 0) {
                query[field] = operators;
            }

        } else {
            // value bình thường
            query[field] = value;
        }
    });

    return query;
};
const getAllListing = (limit,page,sort,filters) => {
    return new Promise(async (resolve,reject) => {
        try {
           const parsedFilters = filters ? JSON.parse(filters) : {};

            // base query (không có keyword)
            const query = {
                ...buildQuery(filters),
                isDeleted: { $ne: true }
            };

            // xử lý keyword riêng
            if (parsedFilters.keyword && parsedFilters.keyword.trim() !== "") {

                const keywords = parsedFilters.keyword.trim();

                query.$or = [
                        { Title: { $regex: keywords, $options: "i" } },
                        { Description: { $regex: keywords, $options: "i" } }
                    ]
                
            }
            let sortObject = { createdAt: -1,_id: -1}; //default
            if(sort && sort.order){
                const fieldMap = {
                    createdAt: "createdAt"
                }
                const field = fieldMap[sort.field] || sort.field;
                sortObject = {
                    [field]: sort.order === "ascend" ? 1 : -1
                }
            }
            
            // Run in parallel for optimal performance
            const AllListing = await Listing.find(query)
                                    .sort(sortObject)
                                    .skip((page - 1) * limit)
                                    .limit(limit);
            const totalListing = await Listing.countDocuments(query).where("isDeleted").ne(true);
            const countitemdelete = await Listing.countDocuments({isDeleted: true});
            

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: AllListing,
                total: totalListing,
                pageCurrent: page,
                itemdeleted: countitemdelete,
                totalPage: Math.ceil(totalListing / limit)
            })
        }catch(e){
            console.log(e);
            reject(e);
        }
    })
}
const getAllListingDeleted = (limit,page,sort) => {
    return new Promise(async (resolve,reject) => {
        try {
            const totalListing = await Listing.countDocuments({isDeleted:true});
            let queryBuilder = Listing.find({isDeleted:true})
                .limit(limit)
                .skip((page - 1) * limit);
            if (sort && sort.field) {
                const sortObject = {};
                sortObject[sort.field] = sort.order === "ascend" ? 1 : -1;
                queryBuilder = queryBuilder.sort(sortObject);
            }
            const AllListing = await queryBuilder;
            
            
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: AllListing,
                total: totalListing,
                pageCurrent: page,
                totalPage: Math.ceil(totalListing / limit)
            })
        }catch(e){
            reject(e);
        }
    });
}
const getDetailsListing = (id) => {
    return new Promise(async (resolve,reject) => {
        try {
            const data = await Listing.aggregate([
                {
                    $match:{
                        isDeleted:false,
                        _id:new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let : {userid:"$User"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$_id",
                                            { $toObjectId: "$$userid" }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    fullname: 1,
                                    email: 1,
                                    phone: 1,
                                }
                            }
                        ],
                        as: "UserInfo",
                    }
                },
                {
                     $unwind: {
                        path: "$UserInfo",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
            if(data === null) {
                resolve({
                    status: "OK",
                    message: "the listing is not defined"
                });
            }
            const countnewsofuser = await Listing.countDocuments({isDeleted:false}).where('User').equals(data[0].User);
            delete data[0]["User"];
            data[0]["UserInfo"]["countnew"] = countnewsofuser;
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: {...data[0]}
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}
module.exports = {
    createListing,
    updateListing,
    deleteListing,
    getAllListing,
    getDetailsListing,
    softDeleteListing,
    getAllListingDeleted,
    restoreListing 
}