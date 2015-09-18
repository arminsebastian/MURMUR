var express = require('express');
var firebase = require('./firebase');
var tokenFactory = require('./firebaseTokenFactory').tokenFactory;
var app = express();
var bodyParser = require('body-parser');
var Cookies = require("cookies");
var serverUrl = '0.0.0.0';
var fs = require('fs');
var auth = require('./auth');

app.use('/', express.static('client'));
app.use(bodyParser.json());

app.use(Cookies.express());

app.post('/', function(request, response){ //request.body.url = 'newPost'
  firebase.insertPost(request, response);
});

app.post('/checkroom', function(request, response) {

  firebase.checkroom(request, response, function(exists) {
    if (exists) {
      response.cookies.set('token', tokenFactory());
    } else {
      response.send({ redirect: '/' });
    }
  })
})

app.post('/signin', function(request, response){  
  var user = request.body;
  console.log("logging in user: ", user);
  auth.login(user, function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed", error);
      response.send({"loginSuccessful": false});
    } else {
      console.log("Authenticated successfully with payload:", authData);
      response.send({"loginSuccessful": true});
    }
  });
})

app.post('/create', function(request, response){
  var roomnameLength = 8;
  var roomname = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, roomnameLength);
  firebase.createRoom(request, response, roomname);
})

app.post('/signup', function(request, response){
  var user = request.body;

  console.log("creating user: ", user);
  auth.createUser(user, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
      response.send({"loginSuccessful": false});
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      response.send({"loginSuccessful": true});
    }
  });
})

app.post('/comment', function(request, response){ //request.body.url = 'newPost'
  firebase.comment(request, response);
})

app.post('/vote', function(request,response){ //request.body.url = 'newPost'
  firebase.votePost(request, response);
})

app.post('/voteComment', function(request,response){ //request.body.url = 'newPost'
  firebase.voteComment(request, response);
})

app.post('/favorite', function(request,response){ //request.body.url = 'newPost'
  firebase.toggleFavorite(request, response);
})

app.listen(3000, serverUrl);