const express = require('express');
const router = express.Router();
const { fetchUserInfoFromCognito } = require('../controllers/userController');
const { getSignedUrl, uploadFileAndStoreMetadata } = require('../controllers/bucketController');
require('dotenv').config();

const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Temporary store files in 'uploads/' folder

router.get('/user-info', async (req, res) => {
  const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

  if (!accessToken) {
    return res.status(401).json({ message: "Access Token is required" });
  }

  try {
    const userInfo = await fetchUserInfoFromCognito(accessToken);
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
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: "Failed to get download URL", error: error.toString() });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const { originalname: name, mimetype: type } = req.file;

  // get courseId, uploaderId from DB
  // const { courseId, uploaderId } = req.body; // Assuming these are sent as part of the form data
  
  try {
    await uploadFileAndStoreMetadata(req.file, { name, type, courseId, uploaderId });

    res.json({ message: "File uploaded and metadata stored successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload file and store metadata.", error: error.toString() });
  }
});

module.exports = router;
