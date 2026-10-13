import mongoose from "mongoose";
const ContractSchema = new mongoose.Schema(
    {
        listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listings",
        required: true
        },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },

        typeContract: {
        type: String,
        enum: ["Sale", "Rental"],
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
            enum: ["new", "signed", "completed", "cancelled"],
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

        terms: { type: String, default: "none" }
    },
    {
        timestamps: true
    }
)
const Contract = mongoose.model("Contracts",ContractSchema);
export {Contract};