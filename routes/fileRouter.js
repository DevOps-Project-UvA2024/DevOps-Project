const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFile = async (bucketName, fileKey, fileBody) => {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBody,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("Successfully uploaded file.", data);
        return data;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
};

const downloadFile = async (bucketName, fileKey) => {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
    };

    try {
        const data = await s3Client.send(new GetObjectCommand(params));
        console.log("Successfully downloaded file.", data);
        // Note: data.Body is a readable stream
        return data.Body;
    } catch (err) {
        console.error("Error downloading file:", err);
        throw err;
    }
};