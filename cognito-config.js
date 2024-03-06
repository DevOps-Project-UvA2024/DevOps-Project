// cognitoConfig.js using AWS SDK v3
const { CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider");
require('dotenv').config();

const REGION = process.env.REGION;
const client = new CognitoIdentityProviderClient({ region: REGION });

module.exports = { client, REGION };
