import mongoose from "mongoose";
import {Contract} from "../models/Contractmodel.js";
import { Users } from "../models/Usermodel.js";
const StatisticalbyType = (limit,page,userId,startDate,endDate,month,quarter,year) => {
    return new Promise(async (resolve, reject) => {

        try {

            const skip = (page - 1) * limit;

            const match = {};

            if (userId) {
                match.ownerId = new mongoose.Types.ObjectId(userId);
            }

            let dateFilter = {};

            // lọc theo khoảng ngày
            if (startDate && endDate) {

                dateFilter = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };

            }

            // lọc theo tháng
            else if (month) {

                const m = Number(month.split("-")[1]);
                const y = Number(month.split("-")[0]);

                dateFilter = {
                    $gte: new Date(y, m - 1, 1),
                    $lt: new Date(y, m, 1)
                };

            }

            // lọc theo quý
            else if (quarter) {

                const q = quarter.split("-")[1];
                const y = Number(quarter.split("-")[0]);

                const arrquarter = ["Q1", "Q2", "Q3", "Q4"];

                const quarterIndex = arrquarter.indexOf(q);

                const startMonth = quarterIndex * 3;

                dateFilter = {
                    $gte: new Date(y, startMonth, 1),
                    $lt: new Date(y, startMonth + 3, 1)
                };

            }

            // mặc định theo năm
            else {

                const y = Number(year);

                dateFilter = {
                    $gte: new Date(y, 0, 1),
                    $lt: new Date(y + 1, 0, 1)
                };

            }

            match.createdAt = dateFilter;

            const result = await Contract.aggregate([

                {
                    $match: match
                },

                {
                    $facet: {

                        contracts: [
                            {
                                $skip: skip
                            },
                            {
                                $limit: limit
                            }
                        ],

                        totalCount: [
                            {
                                $count: "count"
                            }
                        ],

                        totalProfit: [
                            {
                                $group: {
                                    _id: null,
                                    total: {
                                        $sum: "$price"
                                    }
                                }
                            }
                        ]

                    }
                },
                {
                    $project: {

                        contracts: 1,

                        totalitem: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        "$totalCount.count",
                                        0
                                    ]
                                },
                                0
                            ]
                        },

                        totalProfit: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        "$totalProfit.total",
                                        0
                                    ]
                                },
                                0
                            ]
                        }

                    }
                }
            ]);

            resolve({
                status: "OK",
                message: result[0].contracts.length > 0
                    ? "Success"
                    : "No contracts found",
                ...result[0],
                pageCurrent: page
            });

        } catch (error) {

            reject(error);

        }

    });
};
const GetAllOwners = () => {
    return new Promise(async (resolve,reject) => {
        try {
            const result = await Users.find({role: {$ne: "user" }});
            if(result.length > 0){
                resolve({
                    status: "OK",
                    message: "success",
                    result
                })
            }else {
                resolve({
                    status: "OK",
                    message: "cannot found item",
                    result: []
                });
            }
        } catch (err){
            reject(err);
        }
    })
}
module.exports = {
    StatisticalbyType,
    GetAllOwners
}