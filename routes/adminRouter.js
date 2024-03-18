const express = require('express');
const router = express.Router();
const { addCourse } = require('../controllers/courseController');

// This route adds a course to the Course database
// If the operation is successful, it returns a success message
// If the operation fails, it returns an error message
router.post('/courses/add', async (req, res) => {
    try {
        const result = await addCourse(req.body);
        res.status(200).json({ message: result});
    } catch (error) {
        res.status(400).json({ message: error});
    }
});

module.exports = router;
