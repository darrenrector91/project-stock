var myApp = angular
  .module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('lime')
      .warnPalette('red')
      .accentPalette('blue')
      .backgroundPalette('blue-grey')
      .dark();
  });

/// Routes ///
myApp.config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    // console.log('myApp -- config')
    $routeProvider
      .when('/', {
        redirectTo: 'home'
      })
      .when('/home', {
        templateUrl: '/views/templates/home.html',
        controller: 'LoginController as vm'
      })
      .when('/register', {
        templateUrl: '/views/templates/register.html',
        controller: 'LoginController as vm'
      })
      .when('/user', {
        templateUrl: '/views/templates/user.html',
        controller: 'UserController as vm',
        resolve: {
          getuser: function(UserService) {
            return UserService.getuser();
          }
        }
      })
      .when('/expiring-inventory', {
        templateUrl: '/views/templates/expiring-inventory.html',
        controller: 'UserController as vm',
        resolve: {
          getuser: function(UserService) {
            return UserService.getuser();
          }
        }
      })
      .when('/grocery-list', {
        templateUrl: '/views/templates/grocery-list.html',
        controller: 'UserController as vm',
        resolve: {
          getuser: function(UserService) {
            return UserService.getuser();
          }
        }
      })
      .otherwise({
        template: '<h1>404</h1>'
      });
  }
]);
