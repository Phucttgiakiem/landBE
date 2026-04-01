import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        fullname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String, required: true},
        image: {type: String, required: true},
        role: {type: String, required: true, default: "user"},
    },
    {
        timestamps: true,
    }
);  
const Users = mongoose.model("users", userSchema);
export { Users};