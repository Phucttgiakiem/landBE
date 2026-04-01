import mongoose from "mongoose";

const catagoryPropertySchema = new mongoose.Schema(
    {
        Name: { type: String, required: true },
        Type: { 
            type: String, 
            enum:["Nhà đất bán","Nhà đất cho thuê"],
            required: true 
        },
    },
    {
        timestamps: true,
    }
)
const CatagoryProperty = mongoose.model("catagorypropertys", catagoryPropertySchema);
export { CatagoryProperty };