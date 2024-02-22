const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const dotenv = require("dotenv")

const { parsed } = dotenv.config()

const client = jwksClient({
  jwksUri: `https://cognito-idp.${parsed.AWS_REGION}.amazonaws.com/${parsed.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

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
