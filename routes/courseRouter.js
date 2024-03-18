const express = require('express');
const router = express.Router();
const { fetchUserFromDatabase } = require('../utils/userUtils');
const { fetchAllCourses, getTopUploaders, getTopFiles, getCourseAnalytics } = require('../controllers/courseController');

// Fetches all courses from the database personalised for the logged in user 
// Successful operation: returns the requested courses
// Failed operation: returns an error message
router.post('/', async (req, res) => {
  try {
    const userId = (await fetchUserFromDatabase(req)).id;
    const courseInfo = await fetchAllCourses(req.body, userId);
    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch courses", error: error.toString() });
  }
});

// Fetches top uploaders for a specific course
// Successful operation: returns top uploaders for the requested course
// Failed operation: returns an error message
router.get('/:courseid/course-analytics/top-uploaders', getTopUploaders );

// Fetches top files for a specific course
// Successful operation: returns top files for the requested course
// Failed operation: returns an error message
router.get('/:courseid/course-analytics/top-files', getTopFiles );


// Fetches contributors, subscribers, contributions of last week, and activity status for a specific course
// Successful operation: returns contributors, subscribers, contributions of last week, and activity status for the requested course
// Failed operation: returns an error message
router.get('/:courseid/course-analytics/main-course-analytics', getCourseAnalytics );

module.exports = router;
