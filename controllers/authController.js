// signup.js using AWS SDK v3
const { client } = require('../cognito-config');
const { SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
require('dotenv').config();

const signUp = async (email, password, name) => {
    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email },
            {
                Name: "name",
                Value: name
            }
        ],
    };

    try {
        const data = await client.send(new SignUpCommand(params));
        return data; // Contains user details and metadata
    } catch (error) {
        throw error;
    }
};

const signIn = async (username, password) => {
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    try {
        const data = await client.send(new InitiateAuthCommand(params));
        return data.AuthenticationResult; // Contains tokens
    } catch (error) {
        throw error;
    }
};

const verifyUser = async (email, code) => {
    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
    };

    try {
        const data = await client.send(new ConfirmSignUpCommand(params));
        return data; // Confirmation result
    } catch (error) {
        throw error;
    }
};

module.exports = { signIn, signUp, verifyUser };
