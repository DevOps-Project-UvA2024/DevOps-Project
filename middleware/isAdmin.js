const { fetchUserInfoFromCognito } = require('../controllers/userController');

async function isAdmin(req, res, next) {

    const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

    if (!accessToken) {
      return res.status(401).json({ message: "Access Token is required" });
    }

    const userInfo = await fetchUserInfoFromCognito(accessToken);

    if (userInfo && userInfo.role_id == 2) {
      next(); // User is an admin, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  }
  
  module.exports = isAdmin;
  