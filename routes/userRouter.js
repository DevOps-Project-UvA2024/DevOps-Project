const express = require('express');
const router = express.Router();
const { fetchUserInfoFromCognito } = require('../controllers/userController');

// Fetches logged user's info
// If the operation is successful, it returns user info in a JSON format
// If the operation fails, it returns an error message
router.get('/user-info', async (req, res) => {
  try {
    const userInfo = await fetchUserInfoFromCognito(req);
    res.json(userInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user information", error: error.toString() });
  }
});

module.exports = router;
