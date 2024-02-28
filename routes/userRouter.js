const express = require('express');
const router = express.Router();
const { fetchUserInfoFromCognito } = require('../controllers/userController'); // Adjust the path as necessary

router.get('/user-info', async (req, res) => {
  const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

  if (!accessToken) {
    return res.status(401).json({ message: "Access Token is required" });
  }

  try {
    const userInfo = await fetchUserInfoFromCognito(accessToken);
    res.json(userInfo); // Sends back the user information
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user information", error: error.toString() });
  }
});

module.exports = router;
