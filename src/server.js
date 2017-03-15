// -- Includer --
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var path = require('path');
var http = require('http');

// -- Configuration --
var app = express();

// -- Set Port --
app.set('port', process.env.PORT || 5000);

// -- Setup 'jade' --
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// -- Setup 'public path' --
app.use(express.static(__dirname + '/public'));

// -- Setup Other --
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 3600000
  },
  rolling: true,
  resave: true,
  saveUninitialized: false
})); // 1 day

// -- Routing --
var routes = require('./app/routes');
var api = require('./app/api');

app.use('/', routes);
app.use('/', api);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// Set Socket
var io = require('socket.io').listen(server);
app.io = io;
require('./app/socket')(io);

/// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


/// error handlers
// -- dev mode --
app.use(morgan('dev'));


module.exports = app;