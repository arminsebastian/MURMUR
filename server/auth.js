  var Firebase = require('firebase');
var myDataRef = new Firebase('https://donkey.firebaseio.com/');

// Create New Users
module.exports.createUser = function(user){
  myDataRef.createUser({
    "email": user.email,
    "password": user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
};

// Log user in
module.exports.login = function(user, authHandlers){
  myDataRef.authWithPassword({
    "email": user.email,
    "password": user.password
  }, authHandlers);
};

// TODO: Reset password
module.exports.resetPassword = function(user){
  myDataRef.resetPassword({
    email : user.email
  }, function(error) {
    if (error === null) {
      console.log("Password reset email sent successfully");
    } else {
      console.log("Error sending password reset email:", error);
    }
  });
};

// check current auth status
var checkAuth = module.exports.checkAuth = function(){
  var authData = myDataRef.getAuth();
  return authData;
  if (authData) {
    return true;
    // console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    return false;
    // console.log("User is logged out");
  }
}


// // register callback to be fired every time auth state changes
// myDataRef.onAuth(function(authData) {
//   // check if user is new
//   var isNewUser = true;

//   if (authData && isNewUser) {
//     // save the user's profile into the database so we can list users,
//     // use them in Security and Firebase Rules, and show profiles
//     myDataRef.child("users").child(authData.uid).set({
//       provider: authData.provider,
//       name: getName(authData)
//     });
//   }
// });

// function getName(authData) {
//   console.log(authData.provider);
// return authData.
//   //return authData.password.email.replace(/@.*/, '');
//   // switch(authData.provider) {
//   //    case 'password':
//   //      return authData.password.email.replace(/@.*/, '');
//   //    case 'twitter':
//   //      return authData.twitter.displayName;
//   //    case 'facebook':
//   //      return authData.facebook.displayName;
//   // }
// }

// // callback to log current auth state
// function authDataCallback(authData) {
//   if (authData) {
//     console.log("User " + authData.uid + " is logged in with " + authData.provider);
//   } else {
//     console.log("User is logged out");
//   }
// };
