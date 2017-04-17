angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaGeolocation) {
  $scope.selectedCategories = [];
  $scope.distanceValue = 5;
  $scope.categories = [{id: 1, value: "Igrejas"}, {id: 2, value: "Museus"}, {id: 3, value: "Pontes"}];

  $scope.onValueChanged = function(value){
    $scope.selectedCategories = value;
  }

  $scope.onDistanceChanged = function(value){
    $scope.distanceValue = value;
  }

  $scope.searchClick = function () {
    console.log($scope.selectedCategories);
    $scope.locals = [];
    initMap($scope.selectedCategories);
  }

  $scope.selectedLocals = [];

  $scope.clickedLocals = function (member) {
    var index = $scope.selectedLocals.indexOf(member);
    if (index > -1) {
      $scope.selectedLocals.splice(index, 1);
      member.selected = false;
    } else {
      $scope.selectedLocals.push(member);
      member.selected = true;
    }
  }

  var map;
  var infowindow;

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    $scope.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  }, function(error){
    console.log("Could not get location");
  });

  function initMap(categories) {
    var church = false;
    var museum = false;
    var other = false;

    map = new google.maps.Map(document.getElementById('map'), {
      center: $scope.position,
      zoom: 15
    });

    for(var i = 0; i < categories.length; i++){
      if(categories[i].id == 1){
        church = true;
      }else if(categories[i].id == 2){
        museum = true;
      }else{

      }
    }

    var request_churches = {
      location: $scope.position,
      radius: $scope.distanceValue * 1000,
      query: 'igreja',
      type: 'church'
    };

    var request_museums = {
      location: $scope.position,
      radius: $scope.distanceValue * 1000,
      query: 'museu',
      type: 'museum'
    };

    /*var request_bridges = {
      location: porto,
      radius: 5000,
      query: 'ponte'
    };
    */

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    //Call text search for churches
    if(church)
      service.textSearch(request_churches, callback);

    //Call text search for museums
    if(museum)
      service.textSearch(request_museums, callback);

  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        if(results[i].photos != null){
          var local = {name: results[i].name, rating: results[i].rating, photo: results[i].photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})};
        }
        else{
          var local = {name: results[i].name, rating: results[i].rating, photo: null};
        }
        $scope.locals.push(local);
      }
      $scope.$apply();
      console.log($scope.locals);
    }
  }
}])

.controller('cloudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('signupCtrl', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicHistory','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $ionicHistory,$state) {

    $scope.signup=function(data) {
      var link ="http://monrarium.herokuapp.com/api/users/"
      $http.post(link, {name: data.name, username:data.username, password:data.password })
        .then(function (res) {
          $scope.response = res.data.status;
          console.log($scope.response);

          if($scope.response=="Success") {
            $scope.title="Account Created!";
            $scope.template="Your account has been succesfully created!";

            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack:true
            });

            $state.go('menu.login', {}, {location: "replace", reload: true});
          }
          else {
            $scope.title="Failed";
            $scope.template="Username already exists";
          }
          var alertPopup = $ionicPopup.alert({
            title: $scope.title,
            template: $scope.template
          });
        })
    }

}])

.controller('loginCtrl', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicHistory','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $ionicHistory,$state) {

  $scope.login=function(data) {
    var link ="http://monrarium.herokuapp.com/api/users"
    $http.get(link+"?username="+data.username+"&password="+data.password)
      .then(function (res) {
        $scope.response = res.data.status;
        console.log($scope.response);

        if($scope.response=="success") {
          $scope.title="Logged in!";
          $scope.template="You have successfully logged in!";

          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack:true
          });

          $state.go('menu.home', {}, {location: "replace", reload: true});
        }
        else {
          $scope.title="Failed";
          $scope.template="Wrong username/password";
        }
        var alertPopup = $ionicPopup.alert({
          title: $scope.title,
          template: $scope.template
        });
      })
  }
}])

.controller('myProfileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('editProfileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('preferencesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('mapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });
})
