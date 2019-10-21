myApp.service('UserService', [
  '$http',
  '$location',
  '$mdDialog',
  function($http, $location, $mdDialog) {
    // console.log('UserService Loaded');
    var self = this;

    self.categories = {
      list: []
    };

    self.locations = {
      list: []
    };

    self.getStock = {
      list: []
    };

    self.expiringStock = {
      list: []
    };

    self.groceries = {
      list: []
    };

    self.getGroceryList = {
      list: []
    };

    self.userObject = {};

    self.getuser = function() {
      // console.log('UserService -- getuser');
      return $http.get('/api/user').then(
        function(response) {
          self.getCategories();
          self.getLocations();
          self.getStock();
          self.getExpiringInventory();
          self.getGroceryList();
          if (response.data.username) {
            // user has a current session on the server
            self.userObject.username = response.data.username;
            self.userObject.password = response.data.password;
            self.userObject.email = response.data.email;
            // console.log(
            //   'UserService -- getuser -- User Data: ',
            //   response.data.id
            // );
          } else {
            // console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path('/home');
          }
        },
        function(response) {
          // console.log('UserService -- getuser -- failure: ', response);
          $location.path('/home');
        }
      );
    };
    self.logout = function() {
      // console.log('UserService -- logout');
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

    //save stock
    self.addStock = function(data) {
      // console.log(data);
      return $http
        .post('/api/user/addStock', data)
        .then(function(response) {
          self.addStock.list = response.data;
          // console.log('response.data: ', response.data);
          self.getStock();
        })
        .catch(function(error) {
          console.log('error in save user info: ', error);
        });
    }; //end catch edit in form

    self.groceryList = function(data) {
      // console.log(data);
      return $http
        .post('/api/user/grocerylist', data)
        .then(function(response) {
          self.groceries.list = response.data;
          // self.removeFromInventory(data);
        })
        .catch(function(error) {
          console.log('error adding to grocery list: ', error);
        });
    };

    self.getCategories = function() {
      return $http
        .get('/api/user/categories')
        .then(function(response) {
          // console.log(response);
          self.categories.list = response.data;
        })
        .catch(function(response) {
          // console.log('error on get request');
        });
    };

    self.getLocations = function() {
      return $http
        .get('/api/user/locations')
        .then(function(response) {
          self.locations.list = response.data;
        })
        .catch(function(response) {
          console.log('error on get request');
        });
    };

    self.getStock = function() {
      return $http
        .get('/api/user/getStock')
        .then(function(response) {
          // console.log(response);
          self.getStock.list = response.data;
        })
        .catch(function(response) {
          console.log('error on get request');
        });
    };

    self.getExpiringInventory = function() {
      return $http
        .get('/api/user/getExpiringInventory')
        .then(function(response) {
          // console.log(response);
          self.expiringStock.list = response.data;
        })
        .catch(function(response) {
          console.log('error on get request');
        });
    };

    self.getGroceryList = function() {
      return $http
        .get('/api/user/grocerylist')
        .then(function(response) {
          // console.log(response);
          self.getGroceryList.list = response.data;
        })
        .catch(function(response) {
          console.log('error on get request');
        });
    };

    //Delete item from table/database
    // self.deleteItem = function(product_id) {
    //   swal({
    //     text: 'Are you sure you want to delete the data?',
    //     icon: 'warning',
    //     buttons: ['No', 'Yes'],
    //     dangerMode: true
    //   }).then(deleting => {
    //     if (deleting) {
    //       return $http
    //         .delete(`/api/user/deleteItem/${product_id}`)
    //         .then(function(response) {
    //           swal('Data was deleted!');
    //           self.getStock();
    //           self.getExpiringInventory();
    //         })
    //         .catch(function(error) {
    //           console.log('deleteItem error', error);
    //         });
    //     } else {
    //       swal({
    //         text: 'No problem!  The data is safe!!',
    //         icon: 'info',
    //         timer: 2000
    //       });
    //     }
    //   });
    // };

    self.deleteItem = function(product_id) {
      console.log(product_id);
      return $http
        .delete(`/api/user/deleteItem/${product_id}`)
        .then(function(response) {
          self.getStock();
          self.getExpiringInventory();
          self.getGroceryList();
        })
        .catch(function(error) {
          console.log('deleteItem error', error);
        });
    };

    self.deleteItemGroceryList = function(product_id) {
      console.log(product_id);
      return $http
        .delete(`/api/user/deleteItemGroceryList/${product_id}`)
        .then(function(response) {
          self.getStock();
          self.getExpiringInventory();
        })
        .catch(function(error) {
          console.log('deleteItemGroceryList error', error);
        });
    };
  }
]);
