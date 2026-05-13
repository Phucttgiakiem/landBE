import mongoose from "mongoose";
const ContractSchema = new mongoose.Schema(
    {
        listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listings",
        required: true
        },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // sale
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // rent
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

        typeContract: {
        type: String,
        enum: ["sale", "rent"],
        required: true
        },

        price: { type: Number},
        rentalInfo: {
            deposit: Number,
            startDate: Date,
            endDate: Date,
        },
        saleInfo: {
            paymentMethod: String,
            transferDate: Date
        },

        status: {
            type: String,
            enum: ["mới tạo", "đã ký", "xong", "hủy"],
            required: true
        },

        buyerSnapshot: {
            fullName: { type: String},
            idNumber: { type: String},
            address: { type: String}
        },

        ownerSnapshot: {
            fullName: { type: String},
            idNumber: { type: String},
            address: { type: String }
        },

        tenantSnapshot: {
            fullName: { type: String},
            idNumber: { type: String},
            address: { type: String}
        },
        propertySnapshot: {
            title: { type: String},
            address: { type: String },
            area: { type: String }
        },

        terms: { type: String, default: "Không có" }
    },
    {
        timestamps: true
    }
)
const Contract = mongoose.model("Contracts",ContractSchema);
export {Contract};