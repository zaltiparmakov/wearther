var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var sassMiddleware = require('node-sass-middleware');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var database = require('./config/database');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');
// const socketio = require('socket.io');

app = express();
// Set up database; create connection
mongoose.connect(database.dbUrl, { useMongoClient: true});

// Set up database; on estabished connection
mongoose.connection.on('connected', function() {
  console.log('Database connected successful at ' + database.dbUrl);
});
// Set up database; on connection error
mongoose.connection.on('error', function(error) {
  console.log('Database error:' + error);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './uploads/' }).single('photo'));

// const io = socketio(server);
// io.on('connection', (socket) => {
//   console.log('Connected');
//   socket.on('disconnect', () => {
//     console.log('Disconnected');
//   });
// });


// function displayStatus(message) {
//    var notification = new Notification('Nexmo', {
//      body: message,
//      icon: 'images/icon-nexmo.png'
//    });
//  }


var sess = {
  secret: 'weartherapp',
  cookie: { secure:false },
  maxAge: new Date(Date.now() + 3600000),
  resave: false, // don't save session if unmodified
  store: new MongoStore({ 
    url: database.dbUrl,
    touchAfter: 24 * 3600 // time period to update session (if resave is disabled)
  })
}

// use cookies only over HTTPS for production
if(app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy (nginx)
  sess.cookie.secure = true;
}
app.use(session(sess));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport-strategy')(passport);

app.use('/', index);
app.use('/users', users);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;