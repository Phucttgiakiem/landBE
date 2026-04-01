import mongoose from "mongoose";
const ImagepropertySchema = new mongoose.Schema(
    {
        URL: {type:String,require:true},
        Listing: {type: mongoose.Schema.Types.ObjectId, ref: "Listings", required: true},
    },
    {
        timestamps: true,
    }   
)
const Imageproperty = mongoose.model("Imagepropertys", ImagepropertySchema);
export { Imageproperty};