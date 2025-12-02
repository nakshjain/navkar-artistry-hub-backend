const {S3Client} = require("@aws-sdk/client-s3")

const client = new S3Client({
    region: process.env.R2_REGION,
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    }
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

module.exports = {
    client,
    BUCKET,
    PUBLIC_URL
};