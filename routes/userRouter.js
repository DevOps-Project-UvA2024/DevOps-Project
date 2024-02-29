const express = require('express');
const router = express.Router();
const { fetchUserInfoFromCognito } = require('../controllers/userController');
const { getSignedUrl } = require('../controllers/bucketController');
require('dotenv').config();

router.get('/user-info', async (req, res) => {
  try {
    const userInfo = await fetchUserInfoFromCognito(req);
    res.json(userInfo); // Sends back the user information
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user information", error: error.toString() });
  }
});

router.get('/download/:fileKey', async (req, res) => {
  const { fileKey } = req.params;
  const bucketName = process.env.AWS_BUCKET_NAME;

  try {
    const url = await getSignedUrl(bucketName, fileKey);
    res.json(url); // Sends back the signed URL for the file
  } catch (error) {
    res.status(500).json({ message: "Failed to get download URL", error: error.toString() });
  }
});

module.exports = router;
