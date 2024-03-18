const { fetchUserEmailFromCognito } = require("../utils/userUtils.js");
const db = require('../models/index.js');

/**
 * Middleware to check if the logged-in user has an admin role.
 * It uses the user's email obtained from Cognito to fetch the user's role from the database.
 * If the user has an admin role (role_id == 2), the middleware passes control to the next function in the stack.
 * Otherwise, it responds with a 403 Forbidden status and a message indicating restricted access.
 *
 * @param {Object} req - The HTTP request object, containing user credentials.
 * @param {Object} res - The HTTP response object, used to send responses to the client.
 * @param {Function} next - Callback to pass execution to the next middleware function.
*/
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
  