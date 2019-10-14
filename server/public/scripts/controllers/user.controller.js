myApp.controller('UserController', [
  'UserService',
  function(UserService) {
    console.log('UserController created');
    var self = this;
    self.saveUserInfo = UserService.saveUserInfo;
    console.log(self.items);

    // saving user data
    self.saveUserInfo = function(data) {
      UserService.saveUserInfo(data);
    };
  }
]);
