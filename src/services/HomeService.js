import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js";
import {getFavoritelistofuser} from "../services/FavoriteService.js";
import {attachFavorite} from "../utils/Functioncustom.js";
const getAllHome = (userId) => {
    return new Promise(async(resolve,reject) => {
        try {
            const featured = await Listing.aggregate([
                {
                    $match: {
                    approval_status: "đã xác thực",
                    visibility_status: "công khai",
                    type:"vip",
                    isDeleted: false,
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 8
                },
                {
                    $lookup: {
                    from: "imagepropertys", 
                    let: { listingid: "$_id" },
                    pipeline: [
                        {
                        $match: {
                            $expr: { $eq: ["$Listing", "$$listingid"] }
                        }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "images"
                    }
                },
                {
                    $unwind: {
                    path: "$images",
                    preserveNullAndEmptyArrays: true 
                    }
                }
            ]);
            const latest = await Listing.aggregate([
                {
                    $match: {
                        approval_status: "đã xác thực",
                        visibility_status: "công khai",
                        isDeleted: false
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 8
                },
                {
                    $lookup: {
                    from: "imagepropertys", 
                    let: { listingid: "$_id" },
                    pipeline: [
                        {
                        $match: {
                            $expr: { $eq: ["$Listing", "$$listingid"] }
                        }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "images"
                    }
                },
                {
                    $unwind: {
                    path: "$images",
                    preserveNullAndEmptyArrays: true 
                    }
                }
            ]);
            const cheap = await Listing.aggregate([
                {
                    $match: {
                        Price: { $lte: 8000000 },
                        approval_status: "đã xác thực",
                        visibility_status: "công khai",
                        isDeleted: false
                    }
                },
                {
                    $sort: { Price: 1 }
                },
                {
                    $limit: 8
                },
                {
                    $lookup: {
                    from: "imagepropertys", 
                    let: { listingid: "$_id" },
                    pipeline: [
                        {
                        $match: {
                            $expr: { $eq: ["$Listing", "$$listingid"] }
                        }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "images"
                    }
                },
                {
                    $unwind: {
                    path: "$images",
                    preserveNullAndEmptyArrays: true 
                    }
                }
            ]);
            const cities = [
                {_id: "01", name: "Hà Nội"},
                {_id: "46", name: "Huế"},
                {_id: "48", name: "Đà Nẵng"},
                {_id: "79", name: "Hồ Chí Minh"},
                {_id: "75", name: "Đồng Nai"},
            ]
            const cityIds = cities.map(c => c._id);
            const countraw = await Listing.aggregate([
                {
                    $match: {
                    approval_status: "đã xác thực",
                    visibility_status: "công khai",
                    isDeleted: false,
                    "Address.City.id": { $in: cityIds }
                    }
                },
                {
                    $group: {
                    _id: "$Address.City.id",
                    count: { $sum: 1 }
                    }
                } 
            ]);
            const resultMap = countraw.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            const countnews = cities.map(city => ({
                CityID: city._id,
                name: city.name,
                count: resultMap[city._id] || 0
            }));
            let featuredWithFav = null;
            let latestWithFav = null;
            let cheapWithFav = null;
            if(userId) {
                const favList = await getFavoritelistofuser(userId);
                const favSet = new Set(favList.map(f => f.listingId.toString()));
                featuredWithFav = await attachFavorite(featured,favSet);
                latestWithFav = await attachFavorite(latest,favSet);
                cheapWithFav = await attachFavorite(cheap,favSet);
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                featured: !userId ? featured : featuredWithFav,
                latest: !userId ? latest : latestWithFav,
                cheap: !userId ? cheap : cheapWithFav,
                countnews: countnews,
            })
        }catch(e){
            reject(e);
        }
    });
}
const getAllListingRelated = (limit,page,CommuneID,CityID) => {
    return new Promise(async(resolve,reject) => {
        try {
            const pageNum = Number(page);
            const limitNum = Number(limit);

            const query = {
              "Address.Commune.id": CommuneID,
                "Address.City.id": CityID,
                isDeleted: { $ne: true },
                approval_status: "đã xác thực",
                visibility_status: { $nin: ["ẩn", "bị khóa"] }
            }
            const AllListing = await Listing.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        "Address.Commune.id": CommuneID,
                        "Address.City.id": CityID,
                        approval_status: "đã xác thực",
                        visibility_status: { $nin: ["ẩn", "bị khóa"] }
                    },
                },
                {
                    $sort: { createdAt: -1 }
                },
                {   $skip: (pageNum - 1) * limitNum },
                {
                    $limit: limitNum
                },
                {
                    $lookup: {
                    from: "imagepropertys", 
                    let: { listingid: "$_id" },
                    pipeline: [
                        {
                        $match: {
                            $expr: { $eq: ["$Listing", "$$listingid"] }
                        }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "images"
                    }
                },
                
            ])
            
            const totalListing = await Listing.countDocuments(query);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: AllListing,
                total: totalListing,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalListing / limit)
            })
        }catch(e){
            console.log(e);
            reject(e);
        }
    })
}
const buildQuery = (filters) => {
    const query = {};
    if (!filters) return query;

    const objectIdFields = ["CatagoryProperty"];
    const numberFields = ["bedroom", "bathroom", "Toilet"];
    const andConditions = [];

    Object.keys(filters).forEach((field) => {
        if (field === "keyword") return;

        let value = filters[field];

        if (value === null || value === undefined || value === "") return;

        // ObjectId
        if (objectIdFields.includes(field)) {
        andConditions.push({
            [field]: new mongoose.Types.ObjectId(value)
        });
        return;
        }


        // object (range, regex)
        if (typeof value === "object" && !Array.isArray(value)) {
        const operators = {};

        Object.keys(value).forEach((operator) => {
            const val = value[operator];
            if (val === null || val === undefined) return;

            switch (operator) {
            case "gte":
                operators.$gte = Number(val);
                break;
            case "lte":
                operators.$lte = Number(val);
                break;
            case "gt":
                operators.$gt = Number(val);
                break;
            case "lt":
                operators.$lt = Number(val);
                break;
            case "regex":
                operators.$regex = val;
                operators.$options = "i";
                break;
            }
        });

        if (Object.keys(operators).length) {
            andConditions.push({
            [field]: operators
            });
        }

        return;
        }


        if (field === "categoryName") {
        const words = normalize(value).split(" ");

        words.forEach((w) => {
            andConditions.push({
            categoryNormalize: { $regex: w, $options: "i" }
            });
        });

        return;
        }

        if (numberFields.includes(field)) {
            andConditions.push({
                [field]: Number(value)
            });
        } else {
            andConditions.push({
                [field]: value
            });
        }
    });

    if (andConditions.length) {
        query.$and = andConditions;
    }

    return query;
};
const getListingFillter = (limit,page,sorted,filters) => {
    return new Promise(async(resolve,reject) => {
        try {
            let sort = {
                field: null,
                order: null
            };

            if (sorted) {
                const [field, order] = sorted.split("-");
                sort = { field, order };
            }
            const { type, category, area,province, commune, ...restFilters } = filters;

            const baseQuery = buildQuery(restFilters);

            const pipeline = [];


            // 1. MATCH LISTING (price, area, city...)
            const matchStage = {
                isDeleted: { $ne: true }
            };

            if (baseQuery.$and) {
                matchStage.$and = baseQuery.$and;
            }
            if (province) {
                matchStage.$and = matchStage.$and || [];
                matchStage.$and.push({
                    "Address.City.id": province
                });
            }

            if (commune) {
                matchStage.$and = matchStage.$and || [];
                matchStage.$and.push({
                    "Address.Commune.id": commune
                });
            }
            // keyword
            if (filters.keyword && filters.keyword.trim()) {
                const keyword = filters.keyword.trim();

                matchStage.$and = matchStage.$and || [];
                matchStage.$and.push({
                    $or: [
                    { Title: { $regex: keyword, $options: "i" } },
                    { Description: { $regex: keyword, $options: "i" } }
                    ]
                });
            }

            pipeline.push({ $match: matchStage });

            if (area?.gte != null || area?.lte != null) {
                const areaConditions = [];

                const areaExpr = {
                    $multiply: ["$vertical", "$horizontal"]
                };

                if (area.gte != null) {
                    areaConditions.push({
                    $gte: [areaExpr, Number(area.gte)]
                    });
                }

                if (area.lte != null) {
                    areaConditions.push({
                    $lte: [areaExpr, Number(area.lte)]
                    });
                }

                if (areaConditions.length > 0) {
                    pipeline.push({
                    $match: {
                        $expr: {
                        $and: areaConditions
                        }
                    }
                    });
                }
            }

            // LOOKUP CATEGORY
            pipeline.push({
            $lookup: {
                from: "catagorypropertys",
                localField: "CatagoryProperty",
                foreignField: "_id",
                as: "category"
            }
            });

            pipeline.push({ $unwind: "$category" });

            pipeline.push({
                $lookup: {
                    from: "imagepropertys",
                    let: { listingId: "$_id" },
                    pipeline: [
                    {
                        $match: {
                        $expr: {
                            $eq: ["$Listing", "$$listingId"]
                        }
                        }
                    },
                    {
                        $sort: {
                        isPrimary: -1,
                        createdAt: 1
                        }
                    },
                    {
                        $limit: 1
                    },
                    {
                        $project: {
                        _id: 0,
                        url: "$URL"
                        }
                    }
                    ],
                    as: "thumbnail"
                }
                });

                pipeline.push({
                $unwind: {
                    path: "$thumbnail",
                    preserveNullAndEmptyArrays: true
                }
                });

                pipeline.push({
                $addFields: {
                    thumbnail: "$thumbnail.url"
                }
            });

            // 3. MATCH CATEGORY (slug)
            const categoryMatch = {};

            if (type) {
            categoryMatch["category.TypeSlug"] = type;
            }

            if (category) {
            categoryMatch["category.NameSlug"] = category;
            }

            if (Object.keys(categoryMatch).length) {
            pipeline.push({ $match: categoryMatch });
            }

            // 4. SORT
            let sortObject = { createdAt: -1, _id: -1 };

            if (sort?.order) {
                const fieldMap = {
                createdAt: "createdAt",
                price: "Price",
                area: null // không sort trực tiếp
            };

                if (sort.field === "area") {
                    pipeline.push({
                    $addFields: {
                        Area: { $multiply: ["$vertical", "$horizontal"] }
                    }
                    });

                    sortObject = {
                    Area: sort.order === "ascend" ? 1 : -1,
                    _id: -1
                    };
                } else {
                    const field = fieldMap[sort.field] || sort.field;

                    sortObject = {
                    [field]: sort.order === "ascend" ? 1 : -1,
                    _id: -1
                    };
                }
            }

            pipeline.push({ $sort: sortObject });

            // 5. PAGINATION
            pipeline.push({ $skip: (page - 1) * limit });
            pipeline.push({ $limit: limit });

           
            const list = await Listing.aggregate(pipeline);
            
            //console.log("kq ",list);
            // count
            const countPipeline = pipeline.filter(
            (stage) => !stage.$skip && !stage.$limit
            );

            countPipeline.push({ $count: "total" });

            const totalResult = await Listing.aggregate(countPipeline);
            const total = totalResult[0]?.total || 0;
            
         
             resolve({
                status: "OK",
                message: "SUCCESS",
                data: list,
                total,
                pageCurrent: page,
                totalPage: Math.ceil(total / limit)
            })
        }catch(e){
            console.log(e);
            reject(e);
        }
    })
}
module.exports = {
    getAllHome,
    getAllListingRelated,
    getListingFillter
}