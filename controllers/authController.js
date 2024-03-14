// signup.js using AWS SDK v3
const { client } = require('../cognito-config');
const { SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand,
    ConfirmForgotPasswordCommand, ForgotPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
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
        console.log(error);
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
        return data.AuthenticationResult; // Contains tokens and the user returned from the mysql
    } catch (error) {
        console.log("Sign in failed:",error);
        return error;
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
        console.log(error);
    }
};

const resendConfirmationCode = async (email) => {
    try {
        const command = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        });
        const response = await client.send(command);
        console.log("Confirmation code resent successfully:", response);
    } catch (error) {
        console.error("Error resending confirmation code:", error);
    }
}

// Password reset
const initiateReset = async (email) => {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    };
  
    try {
      const command = new ForgotPasswordCommand(params);
      const response = await client.send(command);
      console.log("Password reset initiated:", response);
    } catch (error) {
      console.error("Error initiating password reset:", error);
    }
};

const confirmReset = async (email, verificationCode, newPassword) => {
    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID, // Cognito User Pool App Client ID
        Username: email,
        ConfirmationCode: verificationCode, // The code the user received
        Password: newPassword,
    };

    try {
        const command = new ConfirmForgotPasswordCommand(params);
        const response = await client.send(command);
        console.log("Password reset confirmed:", response);
        return response;
    } catch (error) {
        console.error("Error confirming new password:", error);
        throw error;
    }
};
  

module.exports = { signIn, signUp, verifyUser, resendConfirmationCode, initiateReset, confirmReset };
