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
    console.log($scope);
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

  $scope.clearAll = function() {
    $scope.selectedCategories = [];
    $scope.distanceValue = 5;
    $scope.places = [];
    clearMarkers();
    $scope.categories = [{id: 1, value: "Igrejas"}, {id: 2, value: "Museus"}, {id: 3, value: "Pontes"}];
    $scope.$apply();
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
            $scope.template="Your account has been successfully created!";

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
          sessionStorage.setItem('user_id', res.data.data[0].user_id);
          sessionStorage.setItem('name', res.data.data[0].name);
          sessionStorage.setItem('username', res.data.data[0].username);


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

.controller('myProfileCtrl', ['$scope', '$stateParams','$rootScope','$ionicHistory','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function($scope,$stateParams, $rootScope,$ionicHistory,$state) {

  $scope.logout=function(){

    //delete all the sessions
    delete sessionStorage.user_id;
    delete sessionStorage.username;
    delete sessionStorage.name;

    // remove the profile page backlink after logout.
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });

    // After logout you will be redirected to the menu page,with no backlink
    $state.go('menu.home', {}, {location: "replace", reload: true});
  };

}])

.controller('editProfileCtrl', ['$scope', '$stateParams', '$http', '$ionicPopup', '$ionicHistory','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $ionicHistory,$state) {
  $scope.user_id= sessionStorage.getItem('user_id');
  $scope.name= sessionStorage.getItem('name');
  $scope.username= sessionStorage.getItem('username');

  $scope.edit=function(data) {
    var link ="http://monrarium.herokuapp.com/api/users/"
    $http.put(link+$scope.user_id, {name: data.name, username:$scope.username })
      .then(function (res) {
        $scope.response = res.data.status;
        console.log($scope.response);

        if($scope.response=="success") {
          $scope.title="Name successfully edited!";
          $scope.template="Your name has been successfully edited!";
          sessionStorage.setItem('name', data.name);

          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack:true
          });

          $state.go('menu.myProfile', {}, {location: "replace", reload: true});
        }
        else {
          $scope.title="Failed";
          $scope.template="Couldn't edit name!";
        }
        var alertPopup = $ionicPopup.alert({
          title: $scope.title,
          template: $scope.template
        });
      })
  }



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
