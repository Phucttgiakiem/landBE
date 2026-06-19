import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js";
import {Users} from "../models/Usermodel.js";
import {Contract} from "../models/Contractmodel.js";
import { convertdateformongodb } from "../utils/Functioncustom.js";
const getinfoforCreatecontract = (iduser) => {
    return new Promise (async(resolve,reject) => {
        try {
            const arrproperty = await Listing.aggregate([
                {
                    $match : {
                        User: new mongoose.Types.ObjectId(iduser),
                        isDeleted: false
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: "catagorypropertys",
                        localField: "CatagoryProperty",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: { Type: 1, _id: 0 }
                            }
                        ],
                        as: "Catalog"
                    }
                },
                {
                    $addFields: {
                        Catalog: { $arrayElemAt: ["$Catalog.Type", 0] }
                    }
                }
            ])
            const arrguest = await Users
                    .find({ _id: { $ne: iduser },fullname:{$ne:"admin"},role:{$ne:"sell-user"} })
                    .sort({ createdAt: -1 }).select({password:0});
            resolve({
                status: "OK",
                message: "Success",
                arrproperty,
                arrguest
            })
        } catch (err){
            reject(err);
        }
    })
}
const createContract = (iduser,data) => {
    return new Promise (async(resolve,reject) => {
        try {
            const {idproperty,idbuyer,idtenant,typecontract,price,deposit,startdate,enddate,
                paymentMethod,transferDate,statusContract,fullnamebuyer,idNumberbuyer,addressbuyer,fullnameowner,idNumberowner,addressowner,
                fullnametenant,idNumbertenant,addresstenant,titleproperty,addressproperty,areaproperty,term
            } = data;

            let resultcontract = null;
            if(typecontract === "rent"){
                resultcontract = await Contract.create({
                    listingId:idproperty,
                    tenantId:idtenant,
                    ownerId:iduser,
                    typeContract:typecontract,
                    price:price,
                    rentalInfo:{
                        deposit:deposit,
                        startDate: startdate,
                        endDate: enddate
                    },
                    status: statusContract,
                    ownerSnapshot: {
                        fullName:fullnameowner,
                        idNumber:idNumberowner,
                        address:addressowner
                    },
                    tenantSnapshot: {
                        fullName: fullnametenant,
                        idNumber: idNumbertenant,
                        address: addresstenant
                    },
                    propertySnapshot: {
                        title: titleproperty,
                        address: addressproperty,
                        area: areaproperty
                    },
                    terms:term || undefined
                })
            }else {
                resultcontract = await Contract.create({
                    listingId:idproperty,
                    buyerId:idbuyer,
                    ownerId:iduser,
                    typeContract:typecontract,
                    price:price,
                    saleInfo: {
                        paymentMethod: paymentMethod,
                        transferDate: convertdateformongodb(transferDate),
                    },
                    status: statusContract,
                    ownerSnapshot: {
                        fullName:fullnameowner,
                        idNumber:idNumberowner,
                        address:addressowner
                    },
                    buyerSnapshot: {
                        fullName: fullnamebuyer,
                        idNumber: idNumberbuyer,
                        address: addressbuyer
                    },
                    propertySnapshot: {
                        title: titleproperty,
                        address: addressproperty,
                        area: areaproperty
                    },
                    terms:term || undefined
                })
            }
            
            if(resultcontract){
                resolve({
                    status: "OK",
                    message: "Tạo hợp đồng thành công"
                });
            }else {
                resolve({
                    status: "error",
                    message: "Tạo hợp đồng không thành công, thử lại !!!"
                })
            }
        } catch(err){
            reject(err);
        }
    })
}
const updateContract = (idcontract,userId,data) => {
    return new Promise (async(resolve,reject) => {
        try {
            let response = {};
            const {idproperty,idbuyer,idtenant,typecontract,price,deposit,startdate,enddate,
                paymentMethod,transferDate,statusContract,fullnamebuyer,idNumberbuyer,addressbuyer,fullnameowner,idNumberowner,addressowner,
                fullnametenant,idNumbertenant,addresstenant,titleproperty,addressproperty,areaproperty,term
            } = data;
            let contract = await Contract.findById(idcontract);
            if(!contract){
                response = {
                    status: "error",
                    message: "Không tìm thấy hợp đồng"
                }
            }
            else if(typecontract === "rent"){
                contract.listingId = idproperty;
                contract.typeContract = typecontract;
                contract.ownerId = userId;
                contract.price = price;
                contract.rentalInfo = {
                    deposit:deposit,
                    startDate: startdate,
                    endDate: enddate
                }
                contract.status = statusContract;
                contract.ownerSnapshot = {
                    fullName:fullnameowner,
                    idNumber:idNumberowner,
                    address:addressowner
                }
                contract.tenantSnapshot = {
                    fullName: fullnametenant,
                    idNumber: idNumbertenant,
                    address: addresstenant
                }  
                contract.terms = term || undefined; 
            }else {
                contract.listingId = idproperty;
                contract.ownerId = userId;
                contract.typeContract = typecontract;
                contract.saleInfo = {
                    paymentMethod: paymentMethod,
                    transferDate: convertdateformongodb(transferDate),
                }
                contract.status = statusContract;
                contract.ownerSnapshot = {
                    fullName:fullnameowner,
                    idNumber:idNumberowner,
                    address:addressowner
                }
                contract.buyerSnapshot = {
                    fullName: fullnamebuyer,
                    idNumber: idNumberbuyer,
                    address: addressbuyer
                }
                contract.terms = term || undefined; 
            }
            const resultcontract = await contract.save();
            if(resultcontract){
                response ={   
                    status: "OK",
                    message: "Cập nhật hợp đồng thành công"
                };
            }else {
                response = {
                    status: "error",
                    message: "Cập nhật hợp đồng không thành công, thử lại !!!"
                }
            }
            resolve(response);
        }catch(err){
            reject(err);
        }
    })
}
const buildQuery = (filters) => {

    const query = {};

    if (!filters) return query;

    filters = JSON.parse(filters);

    Object.keys(filters).forEach((field) => {

        let value = filters[field];

        // bỏ qua rỗng
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) return;

        // ARRAY => $in
        if (Array.isArray(value)) {

            if (value.length === 0) return;

            query[field] = {
                $in: value
            };

            return;
        }

        // object operator
        if (
            typeof value === "object" &&
            !Array.isArray(value)
        ) {

            const operators = {};

            Object.keys(value).forEach((operator) => {

                if (
                    value[operator] === null ||
                    value[operator] === undefined ||
                    value[operator] === ""
                ) return;

                let val = value[operator];

                // DATE
                if (field === "createdAt") {

                    const [day, month, year] =
                        val.split("/").map(Number);

                    if (operator === "gte") {

                        val = new Date(
                            year,
                            month - 1,
                            day,
                            0,
                            0,
                            0
                        );
                    }

                    if (operator === "lte") {

                        val = new Date(
                            year,
                            month - 1,
                            day,
                            23,
                            59,
                            59
                        );
                    }
                }

                switch (operator) {

                    case "gte":
                        operators.$gte = val;
                        break;

                    case "lte":
                        operators.$lte = val;
                        break;

                    case "gt":
                        operators.$gt = val;
                        break;

                    case "lt":
                        operators.$lt = val;
                        break;
                }
            });

            if (Object.keys(operators).length > 0) {

                query[field] = operators;
            }

            return;
        }

        // normal value
        query[field] = value;
    });

    return query;
};
const getAllContract = (page,limit,sort,filters,user,role) => {
    return new Promise (async(resolve,reject) => {
        try {
            const parsedFilters = filters ? JSON.parse(filters) : {};

             const query = {
                ...buildQuery(filters)
            };

            if (role === "sell-user") {

                query.ownerId = user;
            }

            if (role === "user") {

                query.$or = [
                    { tenantId: user },
                    { buyerId: user }
                ];
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
            const arrcontract = await Contract.find(query).sort(sortObject).skip((page - 1) * limit).limit(limit);
            const totalcontract = await Contract.countDocuments(query);
            resolve({
                status: "OK",
                message: "Success",
                arrcontract,
                totalPages: Math.ceil(totalcontract / limit),
                currentPage: page,
                total: totalcontract
            })
        } catch(err){
            console.log(err);
            reject(err);
        }
    })
}
const getContractById = (idcontract,iduser) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!mongoose.Types.ObjectId.isValid(idcontract)) {
                return resolve({
                    status: "err",
                    message: "Id contract không hợp lệ"
                })
            }

            if (!mongoose.Types.ObjectId.isValid(iduser)) {
                return resolve({
                    status: "err",
                    message: "Id user không hợp lệ"
                })
            }

            const contract = await Contract.findById(idcontract);

            if (contract) {

                const arrguest = await Users
                    .find({
                        _id: { $ne: new mongoose.Types.ObjectId(iduser) },
                        fullname: { $ne: "admin" }
                    })
                    .sort({ createdAt: -1 })
                    .select({ password: 0 });

                resolve({
                    status: "OK",
                    message: "Success",
                    contract,
                    arrguest
                });

            } else {

                resolve({
                    status: "error",
                    message: "Không tìm thấy hợp đồng"
                })

            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}
const getContractByIdnotiduser = (idcontract) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(idcontract)) {
                return resolve({
                    status: "err",
                    message: "mã hợp đồng không hợp lệ"
                })
            }
            const contract = await Contract.findById(idcontract);

            if (contract) {
                resolve({
                    status: "OK",
                    message: "Success",
                    contract
                });
            }
            else {
                resolve({
                    status: "error",
                    message: "Không tìm thấy hợp đồng"
                })
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }   
    })
}
module.exports = {
    getinfoforCreatecontract,
    createContract,
    updateContract,
    getAllContract,
    getContractById,
    getContractByIdnotiduser
}
