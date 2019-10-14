myApp.service('UserService', [
  '$http',
  '$location',
  '$mdDialog',
  function($http, $location, $mdDialog) {
    console.log('UserService Loaded');
    var self = this;

    self.userObject = {};

    self.getuser = function() {
      console.log('UserService -- getuser');
      return $http.get('/api/user').then(
        function(response) {
          if (response.data.name) {
            // user has a current session on the server
            self.userObject.email = response.data.email;
            self.userObject.password = response.data.password;
            console.log(self.userObject);
            console.log(
              'UserService -- getuser -- User Data: ',
              response.data.id
            );
          } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path('/home');
          }
        },
        function(response) {
          console.log('UserService -- getuser -- failure: ', response);
          $location.path('/home');
        }
      );
    };
    self.logout = function() {
      console.log('UserService -- logout');
      swal({
        text: 'Do you want to log out?',
        icon: 'warning',
        buttons: ['No', 'Yes'],
        dangerMode: true
      }).then(loggingOut => {
        if (loggingOut) {
          return $http.get('/api/user/logout').then(function(response) {
            swal('User was logged out!');
            self.getuser();
            $location.path('/home');
          });
        } else {
          swal({
            text: 'User will remain logged in!',
            icon: 'info'
          });
        }
      });
    };

    //save catch edit in form and return to user view
    self.saveUserInfo = function(data) {
      console.log('returned data from updating user: ', self.userObject.name);
      return $http
        .put('/api/user/saveUserInfo', data)
        .then(function(response) {
          self.saveUserInfo.item = response.data;
          self.getuser();
          console.log('response.data: ', response.data);
        })
        .catch(function(error) {
          console.log('error in save user info: ', error);
        });
    }; //end catch edit in form
  }
]);
