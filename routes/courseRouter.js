const express = require('express');
const router = express.Router();
const { fetchAllCourses } = require('../controllers/courseController');
const { fetchUserEmailFromCognito } = require('../utils/userUtils');
const db = require('../models/index.js');

router.post('/', async (req, res) => {
  try {
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const user = await db.User.findOne({where: { email: loggedUserEmail }});
    const userId = user.dataValues.id;
    const courseInfo = await fetchAllCourses(req.body, userId);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch courses", error: error.toString() });
  }
});

module.exports = router;
