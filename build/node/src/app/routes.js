// ROUTES.js -- RENDER PAGE
var express = require('express');
var app = express.Router();

// -----------------
//  R O U T I N G !
// -----------------

// # ASK #
// -------------
app.get('/', function(req, res) {
  var content = {};
  res.redirect('/attendee')
});

app.get('/attendee/', function(req, res) {
  var content = {};
  res.render('asker', content);
});

app.get('/teacher/ask', function(req, res) {
  var content = {};
  res.render('teacher', content);
});

app.get('/presentation/', function(req, res) {
  var content = {};
  res.render('presentation', content);
});

module.exports = app;
