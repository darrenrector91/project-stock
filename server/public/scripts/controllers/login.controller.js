myApp.controller('LoginController', [
  '$http',
  '$location',
  'UserService',
  function($http, $location, UserService) {
    console.log('LoginController created');
    var self = this;
    self.user = {
      name: '',
      password: '',
      email: ''
    };
    self.message = '';

    self.login = function() {
      if (self.user.username === '' || self.user.password === '') {
        self.message = 'Enter your username and password!';
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/login', self.user).then(
          function(response) {
            if (response.status == 200) {
              console.log('success: ', response.data);
              // location works with SPA (ng-route)
              console.log($location.path('/user'));

              $location.path('/user');
            } else {
              console.log('failure error: ', response);
              self.message = 'Incorrect credentials. Please try again.';
            }
          },
          function(response) {
            console.log('failure error: ', response);
            self.message = 'Incorrect credentials. Please try again.';
          }
        );
      }
    };

    self.registerUser = function() {
      // console.log('in self.registerUser', self.user.username);
      if (
        self.user.username === '' ||
        self.user.password === '' ||
        self.user.email === ''
      ) {
        self.message = 'Username, password and email are required!';
        console.log(self.message);
      } else {
        console.log('sending to server...', self.user);
        $http.post('api/user/register', self.user).then(
          function(response) {
            console.log('success');
            $location.path('/home');
          },
          function(response) {
            // console.log('error');
            self.message = 'Something went wrong. Please try again.';
          }
        );
      }
    };
  }
]);
