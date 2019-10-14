myApp.controller('UserController', [
  'UserService',
  function(UserService) {
    // console.log('UserController created');
    var self = this;
    self.userService = UserService;
    self.saveUserInfo = UserService.saveUserInfo;
    self.userObject = UserService.userObject;
    console.log(self.userObject);

    // saving user data
    self.saveUserInfo = function(data) {
      UserService.saveUserInfo(data);
    };
  }
]);
