const express = require('express');
const router = express.Router();
const { fetchAllSubscriptions, toggleSubscription } = require('../controllers/subscriptionsController');
const { fetchUserFromDatabase } = require('../utils/userUtils');
const db = require('../models/index.js');

// Fetches user subscribed courses
// If the operation is successful, it returns the courses the user has subscribed
// If the operation fails, it returns an error message
router.post('/', async (req, res) => {
  try {
    const userId = (await fetchUserFromDatabase(req)).id; // We use server-side authentication to find the logged user
    const subscriptionInfo = await fetchAllSubscriptions(req.body, userId);
    res.status(200).json(subscriptionInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch subscriptions", error: error.toString() });
  }
});

// Allows the user to subscribe or unsubscribe a course
// If the operation is successful, it returns a success message
// If the operation fails, it returns an error message
router.post('/toggle-subscription', async (req, res) => {
  try {
    const userId = (await fetchUserFromDatabase(req)).id;
    const subscriptionActive = await toggleSubscription(req.body, userId);
    res.status(200).json({ message: `${subscriptionActive} course`});
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch subscriptions", error: error.toString() });
  }
})

module.exports = router;
