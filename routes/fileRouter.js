const express = require('express');
const router = express.Router();
const { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser } = require('../controllers/fileController');
const { fetchUserEmailFromCognito } = require('../utils/userUtils')

router.get('/:course_id', async (req, res) => {
  try {
    const courseInfo = await fetchCoursesFiles(req.params.course_id);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch files", error: error.toString() });
  }
});

router.get('/rating/:fileId', async (req, res) => {
  try {
    const loggedUserEmail = await fetchUserEmailFromCognito(req);
    const userRating = await fetchLoggedUserRating(req.params.fileId, loggedUserEmail);
    res.status(200).json(userRating);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
});

router.post('/rating/:fileId', async (req, res) => {
  try {
    const loggedUserEmail = await fetchUserEmailFromCognito(req);
    const userRating = await rateFileByLoggedUser(req.params.fileId, req.body.rating, loggedUserEmail);
    res.status(200).json(userRating);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user's rating", error: error.toString() });
  }
})
  
module.exports = router;