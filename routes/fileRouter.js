const express = require('express');
const router = express.Router();
const { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser } = require('../controllers/fileController');
const { fetchUserEmailFromCognito } = require('../utils/userUtils');
const db = require('../models/index.js');

router.get('/:course_id', async (req, res) => {
  try {
    console.log(req.params);
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const user = await db.User.findOne({where: { email: loggedUserEmail }});
    const role = user.dataValues.role_id;
    const courseInfo = await fetchCoursesFiles(role, req.params.course_id);
    console.log(courseInfo);
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








  
module.exports = router;