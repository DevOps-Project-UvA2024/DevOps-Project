const express = require('express');
const router = express.Router();
const { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser, getSignedUrl, uploadFileAndStoreMetadata } = require('../controllers/fileController');
const { fetchUserEmailFromCognito } = require('../utils/userUtils');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('../models/index.js');
require('dotenv').config();

router.post('/:course_id', async (req, res) => {
  try {
    console.log(req.params);
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const user = await db.User.findOne({where: { email: loggedUserEmail }});
    const role = user.dataValues.role_id;
    const courseInfo = await fetchCoursesFiles(role, req.params.course_id, req.body);
    return res.status(200).json(courseInfo);
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch files", error: error.toString() });
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
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const user = await db.User.findOne({where: { email: loggedUserEmail }});
    const file = await db.File.findOne({where: { id: req.params.fileId }});
    const userId = user.dataValues.id;
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

router.get('/download/:fileKey', async (req, res) => {
  const { fileKey } = req.params;
  const bucketName = process.env.AWS_BUCKET_NAME;

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