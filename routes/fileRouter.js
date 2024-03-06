const express = require('express');
const router = express.Router();
const { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser, getSignedUrl, uploadFileAndStoreMetadata } = require('../controllers/fileController');
const { fetchUserFromDatabase } = require('../utils/userUtils');
const multer = require('multer');
const db = require('../models/index.js');
require('dotenv').config();

const upload = multer();

router.post('/upload', upload.any(), uploadFileAndStoreMetadata);

router.post('/:course_id', async (req, res) => {
  try {
    const role = (await fetchUserFromDatabase(req)).role_id;
    const courseInfo = await fetchCoursesFiles(role, req.params.course_id, req.body);
    res.status(200).json(courseInfo); // Sending response within the try block
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch files", error: error.toString() });
  }
});

router.get('/rating/:fileId', async (req, res) => {
  try {
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const userRating = await fetchLoggedUserRating(req.params.fileId, loggedUserEmail);
    return res.status(200).json(userRating);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
});

router.post('/rating/:fileId', async (req, res) => {
  try {
    const file = await db.File.findOne({where: { id: req.params.fileId }});
    const userId = (await fetchUserFromDatabase(req)).id;
    const uploaderId = file.dataValues.uploader_id;
    if (userId === uploaderId) return res.status(403).json({ message: "You cannot rate your own file!"});

    const userRating = await rateFileByLoggedUser(req.params.fileId, req.body.rating, userId);
    return res.status(200).json(userRating);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
})

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

router.get('/download/:uploaderName/:uploadTime/:fileName', async (req, res) => {
  const { uploaderName, uploadTime, fileName } = req.params;
  const bucketName = process.env.BUCKET_NAME;
  const fileKey = uploaderName + "/" + uploadTime + "/" + fileName;
  try {
    const url = await getSignedUrl(bucketName, fileKey);
    res.json({url});
  } catch (error) {
    res.status(500).json({ message: "Failed to get download URL", error: error.toString() });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const { originalname: name, mimetype: type } = req.file;

   
  try {
    await uploadFileAndStoreMetadata(req.file, { name, type, courseId, uploaderId });
    res.json({ message: "File uploaded and metadata stored successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload file and store metadata.", error: error.toString() });
  }
});











  
module.exports = router;