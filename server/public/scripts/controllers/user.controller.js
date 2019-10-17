myApp.controller('UserController', [
  'UserService',
  function(UserService) {
    // console.log('UserController created');
    var self = this;
    self.userService = UserService;
    self.saveUserInfo = UserService.saveUserInfo;
    self.userObject = UserService.userObject;
    self.categories = UserService.categories;
    self.locations = UserService.locations;
    self.getStock = UserService.getStock;

    // saving user data
    // self.saveUserInfo = function(data) {
    //   UserService.saveUserInfo(data);
    // };

    self.addStock = function(data) {
      console.log(data);
      UserService.addStock(data);
    };

    self.deleteStockRow = function(product_id) {
      console.log(product_id);
      UserService.deleteStockRow(product_id);
    };
  }
]);
