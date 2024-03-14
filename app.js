const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const checkAuth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin.js');

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const courseRouter = require('./routes/courseRouter.js');
const fileRouter = require('./routes/fileRouter.js');
const adminRouter = require('./routes/adminRouter.js');
const subscriptionRouter = require('./routes/subscriptionRouter.js');

const db = require('./models/index.js');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// API Calls
app.use('/api/users/auth',authRouter);
app.get('/api/check-logged-in', checkAuth, (req, res) => {
  res.status(200).json({ isAuthenticated: true });
});
app.use('/api/courses', checkAuth, courseRouter);
app.use('/api/files', checkAuth, fileRouter);
app.use('/api/subscriptions', checkAuth, subscriptionRouter);

app.use('/api/users/user', checkAuth, userRouter);
app.use('/api/admin', checkAuth, isAdmin, adminRouter);

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

