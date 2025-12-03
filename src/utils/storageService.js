const storage = require('../config/storage')
const {PutObjectCommand} = require("@aws-sdk/client-s3");

async function uploadFile(buffer, mimeType, key) {
    await storage.client.send(
        new PutObjectCommand({
            Bucket: storage.BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        })
    );

    return `${storage.PUBLIC_URL}/${key}`;
}

module.exports = {
    uploadFile
}