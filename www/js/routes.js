angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('menu.home', {
    url: '/home-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.signup', {
    url: '/signup-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('menu.login', {
    url: '/login-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('menu.myProfile', {
    url: '/myprofile-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/myProfile.html',
        controller: 'myProfileCtrl'
      }
    }
  })

  .state('menu.editProfile', {
    url: '/editprofile-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/editProfile.html',
        controller: 'editProfileCtrl'
      }
    }
  })

  .state('menu.preferences', {
    url: '/preferences',
    views: {
      'side-menu21': {
        templateUrl: 'templates/preferences.html',
        controller: 'preferencesCtrl'
      }
    }
  })

  .state('menu.map', {
    url: '/map-page',
    views: {
      'side-menu21': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

    .state('menu.routes', {
      url: '/my-routes',
      views: {
        'side-menu21': {
          templateUrl: 'templates/myRoutes.html',
          controller: 'myRoutes'
        }
      }
    })
$urlRouterProvider.otherwise('/side-menu21/home-page')



});
