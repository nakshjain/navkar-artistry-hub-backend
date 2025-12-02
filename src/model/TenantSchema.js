const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TenantSchema = new Schema(
    {
        brandUserName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        brandName: {
            type: String,
            required: true,
            trim: true
        },
        assignedDomain: {
            type: String,
            required: true,
            trim: true
        },
        customDomain: {
            type: String,
            default: null,
            trim: true
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        plan: {
            type: String,
            enum: ["free", "basic", "pro", "enterprise"],
            default: "free"
        },
        status: {
            type: String,
            enum: ["active", "suspended", "deleted"],
            default: "active"
        },
        settings: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
);

TenantSchema.index({ brandUserName: 1 }, { unique: true });
TenantSchema.index({ customDomain: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Tenant", TenantSchema);