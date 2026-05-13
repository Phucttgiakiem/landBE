import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema(
    {
        listingId: {type:mongoose.Schema.Types.ObjectId,ref: "Listings",required:true},
        userId: {type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
    },
    {
        timestamps: true,
    }
)
const favorite = mongoose.model("favorites",favoriteSchema);
export {favorite}