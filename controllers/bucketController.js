const s3 = require('../amazon/s3.js');

const getSignedUrl = (bucket, fileKey) => {
    const params = {
      Bucket: bucket,
      Key: fileKey,
      Expires: 60
    };
  
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
};

const uploadFileAndStoreMetadata = async (req, res) => {
    const { file } = req; // Assuming file is available in req.file (e.g., using multer for file handling)
    const { courseId, uploaderId } = req.body; // Additional data sent along with the file
  
    if (!file || !courseId || !uploaderId) {
      return res.status(400).send('Missing file or metadata');
    }
  
    const fileName = `${uploaderId}/${Date.now()}/${file.originalname}`;
    const fileType = file.mimetype;
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: fileType,
      ACL: 'public-read', // adjust the ACL according to your needs
    };
  
    // Upload file to S3
    try {
      await s3.upload(s3Params).promise();
  
      // After successful upload, store file metadata in RDS
      const newFile = await db.File.create({
        name: fileName,
        type: fileType,
        upload_date: new Date(),
        active: true,
        course_id: courseId,
        uploader_id: uploaderId,
      });
  
      res.json({ message: 'File uploaded and metadata stored successfully' });
    } catch (error) {
      console.error('Error uploading file or storing metadata:', error);
      res.status(500).json({ error: 'Failed to upload file and store metadata' });
    }
};
  
module.exports = { getSignedUrl, uploadFileAndStoreMetadata };