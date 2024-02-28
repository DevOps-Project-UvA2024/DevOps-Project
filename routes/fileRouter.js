const express = require('express');
const router = express.Router();
const { fetchCoursesFiles } = require('../controllers/fileController');


router.get('/:course_id', async (req, res) => {

    try {
      const courseInfo = await fetchCoursesFiles(req.params.course_id);
      res.json(courseInfo);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch files", error: error.toString() });
    }
  });

  
  
  module.exports = router;