const storage = require('../config/storage')
const {PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");

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

async function deleteFile(key) {
    if (!key) return;

    if (key.startsWith(storage.PUBLIC_URL)) {
        key = key.replace(storage.PUBLIC_URL, "");
    }

    if (key.startsWith("/")) {
        key = key.substring(1);
    }

    await storage.client.send(
        new DeleteObjectCommand({
            Bucket: storage.BUCKET,
            Key: key,
        })
    );
}

module.exports = {
    uploadFile,
    deleteFile
}