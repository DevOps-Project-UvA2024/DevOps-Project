const express = require('express');
const path = require('path');
const app = express();
const checkAuth = require('./middleware/auth');
const authRouter = require('./routes/authRouter');
const cors = require('cors');
app.use(cors());
const cookieParser = require('cookie-parser');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(cookieParser());

// API Calls
app.use('/api/users/auth',authRouter);

app.get('/protected-resource', checkAuth, (req, res) => {
  res.json({ message: 'This is a protected resource accessible only to authenticated users.' });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

