const {S3Client} = require("@aws-sdk/client-s3")

const client = new S3Client({
    region: env.CLOUD_REGION,
    endpoint: `https://${env.CLOUD_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.CLOUD_ACCESS_KEY,
        secretAccessKey: env.CLOUD_SECRET_KEY,
    }
});

const BUCKET = env.CLOUD_BUCKET;
const PUBLIC_URL = env.CLOUD_PUBLIC_URL;

module.exports = {
    client,
    BUCKET,
    PUBLIC_URL
};