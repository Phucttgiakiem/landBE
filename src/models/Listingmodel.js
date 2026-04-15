import mongoose from "mongoose";
const ListingSchema = new mongoose.Schema(
    {
        Title: {type: String, required: true},
        Description: {type: String, required: true},
        Price: {type: Number, required: true},
        Address: {
            numberhouse: {type: String, required: true},
            Commune: {
                id: {type:String, required: true},
                name:{type:String,required:true},
            },
            City:{ 
                id: {type: String, required: true},
                name: {type:String, required: true},
            },
        },
        horizontal: {type: String, required:true},
        vertical: {type: String, required:true},
        front_street: {type: String, required:true},
        floor: {type:Number, required:true},
        bedroom: {type:Number, required:true},
        bathroom: {type:Number, required:true},
        Toilet: {type:Number, required:true},
        Legal: {
            type: String,
            enum: ["sổ đỏ", "sổ hồng", "hợp đồng mua bán", "đang chờ sổ"],
            required:true},
        approval_status: {
            type: String, 
            enum: ["chưa xác thực", "đã xác thực", "từ chối"],
            required:true},
        visibility_status: {
            type: String, 
            enum: ["công khai", "ẩn","bị khóa","hết hạn"],
            required:true},
        User: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
        CatagoryProperty: {type: mongoose.Schema.Types.ObjectId, ref: "catagorypropertys", required: true},
        type: {
            type: String,
            enum: ["normal", "vip"],
            default: "normal"
        },
        ExpiredAt: { type: Date,default: new Date(0) }, 
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: new Date(0) },
    },
    {
        timestamps: true,
    }
);  
const Listing = mongoose.model("Listings", ListingSchema);
export { Listing};