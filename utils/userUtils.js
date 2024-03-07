const { GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { client } = require("../cognito-config"); // Adjust the path as necessary
const db = require('../models/index.js');

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

const fetchUserFromDatabase = async (req) => {
  const loggedUserEmail = await fetchUserEmailFromCognito(req);
  const user = await db.User.findOne({where: { email: loggedUserEmail }});
  return user.dataValues;
}

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