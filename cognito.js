const AmazonCognitoId = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

const poolData = {
UserPoolId: "eu-north-1_R9M5he9af",
ClientId: "1tk5am2ea91tjfvn2aq0ssdt7v"
};
const REGION = "eu-north-1";

const CognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool (poolData);
//Register a new user
const signUp = (name, email, password) => {
    return new Promise ((result, reject) => {
        try {
            //Create an attribute list.
            const attributeList = [];
            attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"name", Value: name}));
            attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"email", Value : email}));
            userPool.signUp(email,password,attributeList,null, (err,data)=> {
                if (err) reject(err);
                else result(data);
            } );
        }
        catch(err){
            reject(err);
        }
    });
}

module.exports.signUp = signUp;

