import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js"
import ImagePtService from "../services/ImagePtService.js";
const createListing = (data,files) => {
    return new Promise(async (resolve, reject) => {
         const {Title,Description,Price,numberhouse,CommuneID,CityID,
                horizontal,vertical,front_street,floor,bedroom,bathroom,Toilet,
                Legal,User,CatagoryProperty
        } = data;
        try {
            const createListing = await Listing.create({
                Title: Title,
                Description: Description,
                Price: Price,
                Address: {
                    numberhouse: numberhouse,
                    CommuneID: CommuneID,
                    CityID: CityID,
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
            });
            if (files && files.length > 0) {
                await ImagePtService.createImagePtmultip(files, createListing._id);
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
            });
        } catch (e) {
            reject(e);
        }
    })
}

const updateListing = (id,data) => {
    return new Promise(async (resolve,reject) => {
        try{
            const checkListing = await Listing.findOne({ _id:id});
            if(checkListing === null){
                resolve({
                    status: "OK",
                    message: "the listing is not defined"
                })
            }
            const updateListing = await Listing.findByIdAndUpdate(id,data,{new:true});
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
const deleteListing = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkListing = await Listing.findOne({ _id:id});
            if(checkListing === null){
                resolve({
                    status: "OK",
                    message: "the listing is not defined"
                })
            }
            await Listing.findByIdAndDelete({_id:id});
            resolve({
                status: "OK",
                message: "Delete Listing success"
            });
        } catch (e) {
            reject(e);
        }
    })
}
const buildQuery = (filters) => {
    const query = {};

    if (!filters) return query;

    filters = JSON.parse(filters);
    Object.keys(filters).forEach((field) => {
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
            const query = buildQuery(filters);
            const totalListing = await Listing.countDocuments(query);
            /* if(filter){
                const objectFilter = {}
                objectFilter[filter[0]] = filter[1];
                const AllListingFilter = await Listing.find(
                    { [filter[0]]: { '$regex': filter[1]}}
                ).limit(limit)
                .skip(page * limit);
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: AllListingFilter,
                    total: totalListing,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalListing / limit)
                })
            }
            if(sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0];
                console.log(objectSort)
                const AllListingSort = await Listing.find()
                .limit(limit)
                .skip(page * limit)
                .sort(objectSort)
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: AllListingSort,
                    total: totalListing,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalListing / limit)
                })
            } */
           let queryBuilder = Listing.find(query)
                .limit(limit)
                .skip((page - 1) * limit);

            if (sort && sort.field) {
                const sortObject = {};
                sortObject[sort.field] = sort.order === "ascend" ? 1 : -1;
                queryBuilder = queryBuilder.sort(sortObject);
            }

            const AllListing = await queryBuilder;

            /* return {
                status: "OK",
                data,
                total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            };
            const AllListing = await Listing.find()
                .limit(limit)
                .skip(page * limit)
                 */
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: AllListing,
                total: totalListing,
                pageCurrent: page + 1,
                totalPage: Math.ceil(totalListing / limit)
            })
        }catch(e){
            reject(e);
        }
    })
}
const getDetailsListing = (id) => {
    return new Promise(async (resolve,reject) => {
        try {
            const data = await Listing.findOne({_id:id});
            if(data === null) {
                resolve({
                    status: "OK",
                    message: "the listing is not defined"
                });
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: data
            });
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createListing,
    updateListing,
    deleteListing,
    getAllListing,
    getDetailsListing
}