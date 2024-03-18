// signup.js using AWS SDK v3
const { client } = require('../cognito-config');
const { SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand,
    ConfirmForgotPasswordCommand, ForgotPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
require('dotenv').config();

/**
 * Signs up a new user with AWS Cognito.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} name - The user's full name.
 * @returns {Promise<Object>} The Cognito user data upon successful registration.
 * @throws {Error} Throws an error if the sign-up process fails.
 */
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

/**
 * Signs in an existing user.
 * 
 * @param {string} username - The user's username (email address).
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} Authentication result containing tokens upon successful sign-in.
 * @throws {Error} Throws an error if sign-in fails.
 */
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


/**
 * Verifies a user's email address using a confirmation code.
 * 
 * @param {string} email - The user's email address to verify.
 * @param {string} code - The verification code sent to the user's email.
 * @returns {Promise<Object>} Confirmation result upon successful verification.
 * @throws {Error} Throws an error if email verification fails.
 */
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

/**
 * Resends the confirmation code to a user's email address.
 * 
 * @param {string} email - The user's email address.
 * @throws {Error} Throws an error if resending the confirmation code fails.
 */
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

/**
 * Initiates a password reset for the user.
 * 
 * @param {string} email - The user's email address.
 * @throws {Error} Throws an error if initiating the password reset fails.
 */
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

/**
 * Confirms a new password for the user using a verification code.
 * 
 * @param {string} email - The user's email address.
 * @param {string} verificationCode - The verification code sent to the user's email.
 * @param {string} newPassword - The new password chosen by the user.
 * @returns {Promise<Object>} Response object upon successful password reset confirmation.
 * @throws {Error} Throws an error if confirming the new password fails.
 */
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
