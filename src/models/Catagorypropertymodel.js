import mongoose from "mongoose";

const catagoryPropertySchema = new mongoose.Schema(
    {
        Name: { type: String, required: true },
        NameSlug: {type:String, unique:true},
        Type: { 
            type: String, 
            enum:["Sale","Rental"],
            required: true 
        },
        TypeSlug: {type:String},
    },
    {
        timestamps: true,
    }
)
const CatagoryProperty = mongoose.model("catagorypropertys", catagoryPropertySchema);
export { CatagoryProperty };