import mongoose from "mongoose";
import {Listing} from "../models/Listingmodel.js";
import {Users} from "../models/Usermodel.js";
import {favorite} from "../models/favoritemodel.js";
const getAdminOverview = ( ) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalUsers = await Users.countDocuments();
            const totalListings = await Listing.countDocuments();

            const now = new Date();

            const start12Months = new Date();
            start12Months.setMonth(now.getMonth() - 11);
            start12Months.setDate(1);
            start12Months.setHours(0, 0, 0, 0);

            // ===== LISTING =====
            const listingByMonth = await Listing.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start12Months },
                        isDeleted:false,
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateTrunc: {
                                date: "$createdAt",
                                unit: "month"
                            }
                        },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },

                // fill thiếu tháng
                {
                    $densify: {
                        field: "_id",
                        range: {
                            step: 1,
                            unit: "month",
                            bounds: [start12Months, now]
                        }
                    }
                },
                {
                    $fill: {
                        output: {
                            total: { value: 0 }
                        }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        month: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$_id"
                            }
                        },
                        value: "$total"
                    }
                }
            ]);

            // ===== USERS =====
            const userByMonth = await Users.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start12Months },
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateTrunc: {
                                date: "$createdAt",
                                unit: "month"
                            }
                        },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },

                {
                    $densify: {
                        field: "_id",
                        range: {
                            step: 1,
                            unit: "month",
                            bounds: [start12Months, now]
                        }
                    }
                },
                {
                    $fill: {
                        output: {
                            total: { value: 0 }
                        }
                    }
                },

                {
                    $project: {
                        _id: 0,
                        month: {
                            $dateToString: {
                                format: "%Y-%m"
                            , date: "$_id"}
                        },
                        value: "$total"
                    }
                }
            ]);

            resolve({
                status: "OK",
                message: "SUCCESS",
                totalUsers,
                totalListings,
                listingChart: listingByMonth,   //  đổi tên cho FE dễ dùng
                userChart: userByMonth
            });

        } catch (err) {
            reject(err);
        }
    });
};
const getSellerOverview = (iduser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userObjectId = new mongoose.Types.ObjectId(iduser);

      // ===== Tổng property =====
      const totalproperty = await Listing.countDocuments({ User: userObjectId });

      // ===== PROPERTY 12 THÁNG =====
      const now = new Date();

      const start12Months = new Date();
      start12Months.setMonth(now.getMonth() - 11);
      start12Months.setDate(1);
      start12Months.setHours(0, 0, 0, 0);

      const propertyByMonth = await Listing.aggregate([
        {
          $match: {
            User: userObjectId,
            isDeleted:false,
            createdAt: { $gte: start12Months }
          }
        },
        {
          $group: {
            _id: {
              $dateTrunc: { date: "$createdAt", unit: "month" }
            },
            total: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },

        //  fill missing month
        {
          $densify: {
            field: "_id",
            range: {
              step: 1,
              unit: "month",
              bounds: [start12Months, now]
            }
          }
        },
        {
          $fill: {
            output: {
              total: { value: 0 }
            }
          }
        },

        {
          $project: {
            _id: 0,
            month: {
              $dateToString: { format: "%m/%Y", date: "$_id" }
            },
            value: "$total"
          }
        }
      ]);


      resolve({
        status: "OK",
        message: "SUCCESS",
        totalproperty,

        // dùng trực tiếp cho chart
        propertyChart: propertyByMonth,
      });

    } catch (err) {
      reject(err);
    }
  });
};
const getUserOverview = (iduser) => {
    return new Promise(async (resolve,reject) => {
        try {
            const topfivepropertynew = await Listing.aggregate([
                {
                  $match: {
                    isDeleted: false
                  }
                },
                {
                  $sort: { createdAt: -1 }
                },
                {
                  $limit: 5
                },
                {
                  $lookup: {
                    from: "imagepropertys",
                    localField: "_id",
                    foreignField: "Listing",
                    pipeline: [
                      { $limit: 1 },
                      {
                        $project: {URL: 1,_id: 0}
                      }
                    ],
                    as: "images"
                  }
                },
                {
                  $addFields: {
                    thumbnail: { $arrayElemAt: ["$images.URL", 0] },
                  }
                },
                {
                  $project: {
                    images: 0,
                  }
                }
            ]);
            resolve({
              status: "OK",
              message: "SUCCESS",
              topfivepropertynew
            })
        } catch(err){
            console.log(err);
            reject(err);
        }
    })
}
module.exports = {
    getAdminOverview,
    getSellerOverview,
    getUserOverview
}