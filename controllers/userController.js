const { fetchUserEmailFromCognito } = require("../utils/userUtils.js");
const db = require('../models/index.js');

/**
 * Retrieves user information from the database based on the user's email obtained from Cognito.
 * 
 * This function calls `fetchUserEmailFromCognito` to get the user's email from their Cognito
 * credentials, then queries the database for the user's information based on this email.
 * It returns the user's database record if found.
 * 
 * @param {Object} req - The request object, expected to include the user's access token.
 * @returns {Promise<Object>} A promise that resolves to the user's information from the database.
 * @throws {Error} Throws an error if there's an issue fetching the user's email from Cognito or querying the database.
 */
const fetchUserInfoFromCognito = async (req) => {
    try {
      const loggedUserEmail = await fetchUserEmailFromCognito(req);

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
