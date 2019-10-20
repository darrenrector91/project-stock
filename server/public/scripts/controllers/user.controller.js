myApp.controller('UserController', [
  'UserService',
  '$filter',
  function(UserService, $filter) {
    // console.log('UserController created');
    var self = this;
    self.userService = UserService;
    self.saveUserInfo = UserService.saveUserInfo;
    self.userObject = UserService.userObject;
    self.categories = UserService.categories;
    self.locations = UserService.locations;
    self.getStock = UserService.getStock;
    self.expiringStock = UserService.expiringStock;
    self.getGroceryList = UserService.getGroceryList;

    self.addStock = function(data) {
      UserService.addStock(data);
    };

    self.deleteStockRow = function(product_id) {
      UserService.deleteStockRow(product_id);
    };

    self.deleteExpiredInventory = function(product_id) {
      UserService.deleteExpiredInventory(product_id);
    };

    self.groceryList = function(data) {
      UserService.groceryList(data);
    };

    self.groceryListDelete = function(data) {
      UserService.groceryListDelete(data);
    };

    self.checkDate = function(date) {
      // Today's date
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy; // console.log(today); // console.log(today[1]);

      displayWarning(date, today);
    };

    displayWarning = function(date, today) {
      dt1 = new Date(date);
      dt2 = new Date(today);
      let dateCheck = Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
          (1000 * 60 * 60 * 24)
      );
      if (dateCheck >= 4) {
        self.isWarning = true;
      } else {
        self.isWarning = false;
      }
    };
  }
]);
