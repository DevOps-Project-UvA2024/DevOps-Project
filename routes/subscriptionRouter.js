const express = require('express');
const router = express.Router();
const { fetchAllSubscriptions } = require('../controllers/subscriptionsController');
const { fetchUserEmailFromCognito } = require('../utils/userUtils');

router.post('/', async (req, res) => {
  try {
    const loggedUserEmail = await fetchUserEmailFromCognito(req, res);
    const user = await db.User.findOne({where: { email: loggedUserEmail }});
    const userId = user.dataValues.id;
    const subscriptionInfo = await fetchAllSubscriptions(req.body, userId);
    res.status(200).json(subscriptionInfo);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch subscriptions", error: error.toString() });
  }
});

module.exports = router;
