const { createProxyMiddleware } = require('http-proxy-middleware');

// Uses localhost ip and 3001 port to communicate with the back-end
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};
