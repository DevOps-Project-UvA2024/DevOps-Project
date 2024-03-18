const express = require('express');
const router = express.Router();
const { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser, getSignedUrl, uploadFileAndStoreMetadata } = require('../controllers/fileController');
const { fetchUserFromDatabase } = require('../utils/userUtils');
const multer = require('multer');
const db = require('../models/index.js');
require('dotenv').config();

const upload = multer({
  limits: { fileSize: 11 * 1024 * 1024 }
});

// Allows the user to upload a file of max 11 MBs
// If the operation is successful, it returns a success message
// If the operation fails, it returns an error message
router.post('/upload', upload.any(), uploadFileAndStoreMetadata);

// Fetches all the files for the requested course, user and filters applied
// If the operation is successful, it returns the files in json format
// If the operation fails, it returns an error message
router.post('/:course_id', async (req, res) => {
  try {
    const role = (await fetchUserFromDatabase(req)).role_id; // Admin can see all files, while casual users only the active ones
    const courseInfo = await fetchCoursesFiles(role, req.params.course_id, req.body);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch files", error: error.toString() });
  }
});

// Fetches user's previous rating for a specific file, if they already have one
// If the operation is successful, it returns the rating of the file
// If the operation fails, it returns an error message
router.get('/rating/:fileId', async (req, res) => {
  try {
    const userId = (await fetchUserFromDatabase(req)).id;
    const userRating = await fetchLoggedUserRating(req.params.fileId, userId);
    return res.status(200).json(userRating);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
});

// Allows user to upload a rating for a specific file
// If the operation is successful, it returns a success message
// If the operation fails, it returns an error message
router.post('/rating/:fileId', async (req, res) => {
  try {
    const file = await db.File.findOne({where: { id: req.params.fileId }});
    const userId = (await fetchUserFromDatabase(req)).id;
    const uploaderId = file.dataValues.uploader_id;
    if (userId === uploaderId) return res.status(403).json({ message: "You cannot rate your own file!"}); // The user cannot rate a file that he has uploaded

    const userRating = await rateFileByLoggedUser(req.params.fileId, req.body.rating, userId);
    return res.status(200).json(userRating);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
})

// Admin can soft delete (disable) a file they deem not useful, dangerous or inappropriate
// If the operation is successful, it returns a success message
// If the operation fails, it returns an error message
router.post('/disabling/:fileId', async (req, res) => {
  try {
    
    const { active } = req.body;
    const fileId = req.params.fileId;
    const file = await db.File.findByPk(fileId);
    file.active = active;
    await file.save();
    res.status(200).json({ message: "File visibility updated successfully" });
  } 
  catch (error) {
    res.status(400).json({ message: "Failed to update file visibility", error: error.toString() });
  }
});

// Allows the user to download a specific file from the S3 Bucket
// If the operation is successful, it returns the url to allow the browser to download the file
// If the operation fails, it returns an error message
router.get('/download/:uploaderName/:uploadTime/:fileName', async (req, res) => {
  const { uploaderName, uploadTime, fileName } = req.params; // Files inside S3 are uploaded in the form of /uploader username/timestamp of upload datetime/actual file name
  const bucketName = process.env.BUCKET_NAME;
  const fileKey = uploaderName + "/" + uploadTime + "/" + fileName;
  try {
    const url = await getSignedUrl(bucketName, fileKey);
    res.json({url});
  } catch (error) {
    res.status(500).json({ message: "Failed to get download URL", error: error.toString() });
  }
});
  
module.exports = router;