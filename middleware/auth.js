const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();


//Initializes a JWKS client with the URI to the JWKS (JSON Web Key Set) endpoint of an AWS Cognito User Pool.
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

/**
 * Retrieves the signing key from AWS Cognito's JWKS endpoint using the specified key ID (kid).
 * 
 * @param {Object} header - The JWT header containing the key ID (kid).
 * @param {Function} callback - A callback function to return the signing key or an error.
 */
function getKey(header, callback){
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        console.error('Error getting signing key: ', err);
        callback(err, null);
        return;
      }
  
      if (!key) {
        console.error('No key found matching kid:', header.kid);
        callback(new Error('No matching key found'), null);
        return;
      }
  
      const signingKey = key.publicKey || key.rsaPublicKey;
      if (!signingKey) {
        console.error('No publicKey or rsaPublicKey found in key:', key);
        callback(new Error('No publicKey or rsaPublicKey found'), null);
        return;
      }
  
      callback(null, signingKey);
    });
}

/**
 * Middleware function to authenticate and authorize a user based on the JWT token provided in the request cookies.
 * 
 * @param {Object} req - Express.js request object, expected to contain the JWT token in cookies.
 * @param {Object} res - Express.js response object, used to send back an authentication failure message.
 * @param {Function} next - Express.js callback to pass control to the next middleware function.
 */
const checkAuth = (req, res, next) => {
    // Extract the token from cookies
    const token = req.cookies['accessToken']; // Assuming you set the token as 'accessToken' cookie

    if (!token) {
        return res.status(401).json({ message : 'Token not provided', isAuthenticated: false});
    }

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, function(err, decoded) {
        if (err) {
            return res.status(401).json({ message : 'Token is invalid', isAuthenticated: false});
        }
        req.user = decoded; // Add decoded user to request
        next();
    });
};

module.exports = checkAuth;
