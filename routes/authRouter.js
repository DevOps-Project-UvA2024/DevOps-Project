const express = require('express');
const router = express.Router();
const { signUp, signIn, verifyUser, resendConfirmationCode, initiateReset, confirmReset } = require('../controllers/authController');
const { checkUserCreation } = require("../utils/userUtils.js");

// Sign up route
// Successful operation: creates unverified user in AWS Cognito and returns a success message
// Failed operation: returns an error message
router.post('/signup', async (req, res) => {
    try {
        const username = await signUp(req.body.email, req.body.password, req.body.name);
        res.json({ success: true, username: username });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Sign in route
// Successful operation: signs in user in AWS Cognito which returns the access and id token, which are passed as cookies to ensure
// the user stays logged in, afterwards it returns a success message
// Failed operation: returns an error message, with information about the signin failure
router.post('/signin', async (req, res) => {
    try {
        const authResult = await signIn(req.body.username, req.body.password);
        res.cookie('accessToken', authResult.AccessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
        res.cookie('idToken', authResult.IdToken, { httpOnly: true, secure: false, sameSite: 'lax' });
        await checkUserCreation(authResult.AccessToken, req.body.username);
        res.status(200).json({ message: 'Authentication successful' });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Verify user route
// Successful operation: verifies the user in AWS Cognito and returns a success message
// Failed operation: returns an error message
router.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    try {
        const result = await verifyUser(email, code);
        res.json({ message: "User verified successfully", details: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to verify user", error: error.message });
    }
});

// Resend Verification code
// Successful operation: sends a verification email to the requested user and returns a successful message
// Failed operation: returns an error message
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await resendConfirmationCode(email);
        res.json({ message: "Successfully resent verification email", details: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to resend verification email", error: error.message });
    }
});

// Resend Verification code
// Successful operation: sends a reset password email to the requested user and returns a successful message
// Failed operation: returns an error message
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await initiateReset(email);
        res.json({ message: "Successfully initiated reset password", details: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to initiate reset password", error: error.message });
    }
});

// Resend Verification code
// Successful operation: confirms the change of password and returns a success message
// Failed operation: returns an error message
router.post('/confirm-reset-password', async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    try {
        const result = await confirmReset(email, verificationCode, newPassword);
        res.json({ message: "Successfully reset password", details: result });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to reset password", error: error.message });
    }
});

// Sign out route
// Successful operation: clears cookies to sign out user and returns a success message
router.get('/signout', (_, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('idToken');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
