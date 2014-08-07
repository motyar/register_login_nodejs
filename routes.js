var passport = require('passport');
var Account = require('./models/account');
var bcrypt = require('bcrypt-nodejs');
module.exports = function (app) {
    
  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register', function(req, res) {
      Account.register(new Account({ username : req.body.username, apikey:bcrypt.hashSync(req.body.passport, bcrypt.hashSync(req.body.username)) }), req.body.password, function(err, account) {
          if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
          }

          passport.authenticate('local')(req, res, function () {
            res.redirect('/');
          });
      });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });

  app.get('/api/unauthorized', function(req, res){
      res.send("Login failed", 200);
  });

app.get('/api/authenticate', 
  passport.authenticate('localapikey', {
     failureRedirect: '/api/unauthorized' }),
       function(req, res) {
            res.redirect('/');
               
               });
 
};
