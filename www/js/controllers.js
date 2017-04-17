angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$ionicTabsDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaGeolocation, $ionicTabsDelegate) {
  $scope.selectedCategories = [];
  $scope.distanceValue = 5;
  $scope.categories = [{id: 1, value: "Igrejas"}, {id: 2, value: "Museus"}, {id: 3, value: "Pontes"}];

  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
  }

  $scope.onValueChanged = function(value){
    $scope.selectedCategories = value;
  }

  $scope.onDistanceChanged = function(value){
    $scope.distanceValue = value;
  }

  $scope.searchClick = function () {
    console.log($scope.selectedCategories);
    $scope.places = [];
    $scope.initMap($scope.selectedCategories);
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
    console.log($scope.selectedLocals);
  }


  var map;
  var infowindow;
  var markers = [];

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    $scope.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  }, function(error){
    console.log("Could not get location");
  });


  $scope.initMap = function (categories) {
    var church = false;
    var museum = false;
    var other = false;

    map = new google.maps.Map(document.getElementById('map'), {
      center: $scope.position,
      zoom: 15
    });

    var marker = new google.maps.Marker({
      map: map,
      position: $scope.position,
      label: "Está aqui!"
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent("Você está aqui!");
      infowindow.open(map, this);
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
      for (var i = 0; i < results.length; i++) {
        if(results[i].photos != null){
          var place = {
            name: results[i].name,
            rating: results[i].rating,
            photo: results[i].photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300}),
            location: results[i].geometry.location
          };
        }
        else{
          var place = {
            name: results[i].name,
            rating: results[i].rating,
            photo: null,
            location: results[i].geometry.location
          };
        }
        $scope.places.push(place);
        createMarker(place);
      }
      $scope.$apply();
      console.log($scope.places);
    }
  }

  function createMarker(place) {
    var placeLoc = place.location;
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
    markers = [];
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }

  $scope.filterMarkers = function (){
    clearMarkers();
    for(var i = 0; i < $scope.selectedLocals.length; i++){
      markers.push(createMarker($scope.selectedLocals[i]));
    }

    $scope.selectTabWithIndex(0);
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

.controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


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
