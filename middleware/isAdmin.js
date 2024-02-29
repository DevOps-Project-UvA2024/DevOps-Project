const { fetchUserEmailFromCognito } = require("../utils/userUtils.js");
const db = require('../models/index.js');

async function isAdmin(req, res, next) {

    const loggedUserEmail = await fetchUserEmailFromCognito(req);
    const userInfo = await db.User.findOne({ where: { email: loggedUserEmail } });

    if (userInfo && userInfo.dataValues.role_id == 2) {
      next(); // User is an admin, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  }
  
  module.exports = isAdmin;
  