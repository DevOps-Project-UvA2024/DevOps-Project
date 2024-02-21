var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const http = require("http");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')

var app = express();
const server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", authRouter);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { message : err.message});
});

module.exports = app;
try {
  //Listen mode.
  app.listen (4000, "127.0.0.1", () => {
  console.log("Server running");
  });

  app.use("auth", routes);

}
catch (err) {
  console.log("error", err);
}

const onClose = () => {
  process.exit();
};

//Handle process server.
process.on("SIGTERM", onClose);
process.on("SIGINT", onClose);
process.on("uncaughtException", onClose);