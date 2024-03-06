const express = require('express');
const router = express.Router();
const { fetchUserFromDatabase } = require('../utils/userUtils');
const { fetchAllCourses, getTopUploaders, getTopFiles } = require('../controllers/courseController');

router.post('/', async (req, res) => {
  try {
    const userId = (await fetchUserFromDatabase(req)).id;
    const courseInfo = await fetchAllCourses(req.body, userId);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch courses", error: error.toString() });
  }
});

router.get('/:courseid/course-analytics/top-uploaders', getTopUploaders );

router.get('/:courseid/course-analytics/top-files', getTopFiles );


module.exports = router;
