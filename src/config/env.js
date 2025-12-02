require("dotenv").config();

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: process.env.PORT || 3000,
    ORIGIN_URL: process.env.ORIGIN_URL,
    DATABASE: process.env.DATABASE,

    BASE_DOMAIN: process.env.BASE_DOMAIN,

    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,

    SALT: process.env.SALT,
    TOKEN_PRIVATE_KEY: process.env.TOKEN_PRIVATE_KEY,

    RAZOR_PAY_KEY_ID: process.env.RAZOR_PAY_KEY_ID,
    RAZOR_PAY_KEY_SECRET: process.env.RAZOR_PAY_KEY_SECRET,

    //STORAGE PROVIDER TYPE
    CLOUD_PROVIDER: process.env.CLOUD_PROVIDER,
    //ACCESS KEYS (always required)
    CLOUD_ACCESS_KEY: process.env.CLOUD_ACCESS_KEY,
    CLOUD_SECRET_KEY: process.env.CLOUD_SECRET_KEY,
    //BUCKET DETAILS (always required)
    CLOUD_BUCKET: process.env.CLOUD_BUCKET,
    CLOUD_PUBLIC_URL: process.env.CLOUD_PUBLIC_URL,
    //ACCOUNT / PROJECT / REGION DETAILS (depends on provider)
    CLOUD_ACCOUNT_ID: process.env.CLOUD_ACCOUNT_ID,
    CLOUD_REGION: process.env.CLOUD_REGION,
    CLOUD_PROJECT_ID: process.env.CLOUD_PROJECT_ID,
    CLOUD_ENDPOINT: process.env.CLOUD_ENDPOINT,
};

globalThis.env = config

module.exports = config