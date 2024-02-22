// In your Express route handlers file (e.g., routes.js or within app.js)
const express = require('express');
const router = express.Router();
const { signUp, signIn, verifyUser } = require('../controllers/authController');

// Sign up route
router.post('/signup', async (req, res) => {
    try {
        const username = await signUp(req.body.email, req.body.password, req.body.name);
        res.json({ success: true, username: username });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Sign in route
router.post('/signin', async (req, res) => {
    try {
        const authResult = await signIn(req.body.username, req.body.password);
        console.log(authResult)
        // Use result as needed, for example, return tokens
        res.json({ success: true, tokens: authResult });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Verify user route
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

module.exports = router;
