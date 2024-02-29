const express = require('express');
const router = express.Router();
const { addCourse } = require('../controllers/courseController');

router.post('/courses/add', async (req, res) => {
    try {
        const result = await addCourse(req.body);
        res.status(200).json({ message: result});
    } catch (error) {
        res.status(400).json({ message: error});
    }
});

module.exports = router;
