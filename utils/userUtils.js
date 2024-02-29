const { GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { client } = require("../cognito-config"); // Adjust the path as necessary
const db = require('../models/index.js');

const fetchUserEmailFromCognito = async (req, res) => {

    const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

    if (!accessToken) {
      return res.status(401).json({ message: "Access Token is required" });
    }

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

const checkUserCreation = async (req, res) => {

  const user = await db.User.findOne({ where: { email: req.body.username } });
  
  if (!user) {
    const accessToken = req.cookies['accessToken']; // Ensure you're extracting the access token correctly

    if (!accessToken) {
      return res.status(401).json({ message: "Access Token is required" });
    }

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
        email: req.body.username,
        role_id: 1
      });
    } catch (error) {
      console.error("Error fetching user info from Cognito:", error);
      throw error;
    }
  }

}

module.exports = { fetchUserEmailFromCognito, checkUserCreation };