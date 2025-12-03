const mongoose = require("mongoose");
const Schema=mongoose.Schema
const tenantPlugin = require("./plugins/tenantPlugin");

const SectionItemSchema = new Schema(
    {
        key: { type: String },
        alt: { type: String },
        label: { type: String },
        image: { type: String },
        href: { type: String },
        description: { type: String },
        tag: { type: String },
        extra: { type: Object }
    },
    { _id: false }
);

const SectionSchema = new Schema(
    {
        id: { type: String, required: true },
        type: {
            type: String,
            enum: ["grid", "carousel", "banner", "hero", "promo", "custom"],
            required: true
        },
        title: { type: String },
        subtitle: { type: String },
        layout: { type: Object },
        items: [SectionItemSchema]
    },
    { _id: false }
);

const BrandingSchema = new Schema(
    {
        brandName: { type: String, required: true },
        brandUserName: { type: String, required: true, unique: true },
        brandLogo: { type: String, required: true },

        titleBackgroundImage: { type: String, required: true },
        titleBackgroundImageMobile: { type: String, required: true },

        primaryColor: { type: String },
        secondaryColor: { type: String },
        themeMode: { type: String, enum: ["light", "dark"], default: "light" },
        customCSS: { type: String }
    },
    { _id: false }
);

const HomePageConfigSchema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: true,
            unique: true
        },

        branding: BrandingSchema,

        sections: [SectionSchema],

        metadata: {
            title: String,
            description: String,
            keywords: [String],
            ogImage: String
        },

        version: { type: Number, default: 1 },
    },
    {
        collection: "homepage_configs",
        timestamps: true
    }
);

HomePageConfigSchema.plugin(tenantPlugin);
const HomePageConfig= mongoose.model("HomePageConfig", HomePageConfigSchema);

module.exports=HomePageConfig
