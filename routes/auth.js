const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
require('dotenv').config();

// Set up AWS Cognito
AWS.config.update({region: 'eu-north-1'});
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const client = new CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  // Add your Cognito signup logic here
});

module.exports = router;
