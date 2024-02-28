const s3 = require('../amazon/s3.js');

const getSignedUrl = (bucket, fileKey) => {
    const params = {
      Bucket: bucket,
      Key: fileKey,
      Expires: 60 // This URL will be valid for 60 seconds
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
  
module.exports = { getSignedUrl };