// Generated by CoffeeScript 1.7.1
(function() {
  var app, express, generateId, logfmt, normalizeURL, port, server, uuid;

  express = require("express");

  logfmt = require("logfmt");

  uuid = require('node-uuid');

  app = express();

  server = require('http').createServer(app);

  app.use(logfmt.requestLogger());

  app.use(express.bodyParser());

  normalizeURL = function(urlRaw) {
    var urlNormal;
    urlNormal = urlRaw;
    return urlNormal.replace(/([\?#].*$)/gi, "");
  };

  generateId = function() {
    return uuid.v1();
  };

  app.get('/', function(req, res) {
    return res.sendfile('dashboard/index.html');
  });

  app.get('/bookmarklet/:file(*)', function(req, res) {
    return res.sendfile('bookmarklet/' + req.params.file);
  });

  app.get('/dashboard/:file(*)', function(req, res) {
    return res.sendfile('dashboard/' + req.params.file);
  });

  app.get('/bookmarklet/compiled/:file', function(req, res) {
    return res.sendfile('bookmarklet/compiled/' + req.params.file);
  });

  app.get('/bookmarklet/library/:file', function(req, res) {
    return res.sendfile('bookmarklet/library/' + req.params.file);
  });

  app.get('/dashboard/compiled/:file', function(req, res) {
    return res.sendfile('dashboard/compiled/' + req.params.file);
  });

  app.get('/dashboard/library/:file', function(req, res) {
    return res.sendfile('dashboard/library/' + req.params.file);
  });

  app.post('/new_peer', function(req, res) {
    if (!req.body.hasOwnProperty("full_url") || !req.body.hasOwnProperty("page_id")) {
      res.send(500, {
        error: "Must specify full_url and page_id parameters"
      });
      return;
    }
    return res.send(JSON.stringify(result));
  });

  port = process.env.PORT || 5000;

  server.listen(port, function() {
    return console.log("Listening on " + port);
  });

}).call(this);
