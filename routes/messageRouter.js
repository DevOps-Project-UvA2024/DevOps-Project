const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Define the route and attach the controller
router.get('/new-message', messageController.getMessage);
router.get('/new-message-2', messageController.getMessage2);

module.exports = router;
