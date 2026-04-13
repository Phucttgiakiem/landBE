
import {Listing} from "../models/Listingmodel.js"

const getAllHome = () => {
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
                    "Address.CityID": { $in: cityIds }
                    }
                },
                {
                    $group: {
                    _id: "$Address.CityID",
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
            resolve({
                status: "OK",
                message: "SUCCESS",
                featured: featured,
                latest: latest,
                cheap: cheap,
                countnews: countnews,
            })
        }catch(e){
            reject(e);
        }
    });
}
module.exports = {
    getAllHome
}