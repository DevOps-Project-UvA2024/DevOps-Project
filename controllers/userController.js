const { fetchUserEmailFromCognito } = require("../utils/userUtils.js")

const db = require('../models/index.js');

const fetchUserInfoFromCognito = async (req) => {
    try {
      const loggedUserEmail = await fetchUserEmailFromCognito(req)

      const userInfo = await db.User.findOne({
        where: { email:loggedUserEmail }
      });
      
      return userInfo;
    } catch (error) {
      console.error("Error fetching user info from Cognito:", error);
      throw error;
    }
  };

module.exports = { fetchUserInfoFromCognito };
