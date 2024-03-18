const { GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { client } = require("../cognito-config"); // Adjust the path as necessary
const db = require('../models/index.js');

/**
 * Fetches the user's email address from AWS Cognito using the provided access token.
 * 
 * @param {Object} req - The request object containing cookies with an access token.
 * @returns {Promise<string>} A promise that resolves to the user's email address.
 * @throws {Error} Throws an error if fetching user info from Cognito fails.
 * @example
 * const email = await fetchUserEmailFromCognito(req);
 */
const fetchUserEmailFromCognito = async (req) => {

    const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

    const command = new GetUserCommand({
      AccessToken: accessToken,
    });
  
    try {
      const { UserAttributes } = await client.send(command);
      // Convert the array of attributes into a more accessible object format
      const attributes = UserAttributes.reduce((acc, attr) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {});
      
      return attributes.email; 
    } catch (error) {
      console.error("Error fetching user info from Cognito:", error);
      throw error;
    }
  };

/**
 * Fetches a user's details from the database using their email address obtained from Cognito.
 * 
 * @param {Object} req - The request object containing cookies with an access token.
 * @returns {Promise<Object>} A promise that resolves to the user's details from the database.
 * @throws {Error} Throws an error if the user cannot be found or the database query fails.
 * @example
 * const userDetails = await fetchUserFromDatabase(req);
 */
const fetchUserFromDatabase = async (req) => {
  const loggedUserEmail = await fetchUserEmailFromCognito(req);
  const user = await db.User.findOne({where: { email: loggedUserEmail }});
  return user.dataValues;
}

/**
 * Checks if a user exists in the database by their email; if not, it fetches their information from Cognito 
 * and creates a new user entry in the database.
 * 
 * @param {string} accessToken - The access token to authenticate the request to Cognito.
 * @param {string} email - The email address of the user to check or create in the database.
 * @returns {Promise<void>} A promise that resolves when the check is complete and the user is created if necessary.
 * @throws {Error} Throws an error if fetching from Cognito or creating a new user fails.
 * @example
 * await checkUserCreation(accessToken, 'user@example.com');
 */
const checkUserCreation = async (accessToken, email) => {

  const user = await db.User.findOne({ where: { email: email } });
  
  if (!user) {

    const command = new GetUserCommand({
      AccessToken: accessToken,
    });
  
    try {
      const { UserAttributes } = await client.send(command);

      const attributes = UserAttributes.reduce((acc, attr) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {});

      await db.User.create({
        username: attributes.name,
        email: email,
        role_id: 1
      });
    } catch (error) {
      console.error("Error fetching user info from Cognito:", error);
      throw error;
    }
  }

}

module.exports = { fetchUserEmailFromCognito, checkUserCreation, fetchUserFromDatabase };