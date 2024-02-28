const { GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { client } = require("../cognito-config"); // Adjust the path as necessary

const db = require('../models/index.js');

const fetchUserInfoFromCognito = async (accessToken) => {
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
      

      const userInfo = await db.User.findOne({
        where: { email:attributes.email }
      });
      
      return userInfo; // Return only the user attributes object
    } catch (error) {
      console.error("Error fetching user info from Cognito:", error);
      throw error;
    }
  };

module.exports = { fetchUserInfoFromCognito };
