import mongoose from "mongoose";
const ListingSchema = new mongoose.Schema(
    {
        Title: {type: String, required: true},
        Description: {type: String, required: true},
        Price: {type: Number, required: true,default: 0},
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
        horizontal: {type: Number, required:true},
        vertical: {type: Number, required:true},
        front_street: {type: String, required:true},
        floor: {type:Number, required:true},
        bedroom: {type:Number, required:true},
        bathroom: {type:Number, required:true},
        Toilet: {type:Number, required:true},
        Legal: {
            type: String,
            enum: ["RC", "PIC", "SC", "PEC"],
            required:true},
        approval_status: {
            type: String, 
            enum: ["pending", "approved", "rejected"],
            required:true},
        visibility_status: {
            type: String, 
            enum: ["public", "private","blocked","expired"],
            required:true},
        User: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
        CatagoryProperty: {type: mongoose.Schema.Types.ObjectId, ref: "catagorypropertys", default: null},
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