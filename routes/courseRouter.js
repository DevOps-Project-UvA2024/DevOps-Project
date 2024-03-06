const express = require('express');
const router = express.Router();
const { fetchAllCourses, getTopUploaders } = require('../controllers/courseController');

router.post('/', async (req, res) => {
  try {
    const courseInfo = await fetchAllCourses(req.body);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch courses", error: error.toString() });
  }
});

router.get('/:courseid/course-analytics', getTopUploaders );

module.exports = router;
