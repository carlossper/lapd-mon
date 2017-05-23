angular.module('app.controllers', [])

.controller('homeCtrl', ['$scope', '$stateParams', '$cordovaGeolocation', '$ionicTabsDelegate', '$state', 'MapMarkers', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaGeolocation, $ionicTabsDelegate, $state, MapMarkers) {
  $scope.selectedCategories = [];
  $scope.distanceValue = 5;
  $scope.categories = [{id: 1, value: "Igrejas"}, {id: 2, value: "Museus"}, {id: 3, value: "Pontes"}, {id: 4, value: "Estátuas"}];

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
    $scope.categories = [{id: 1, value: "Igrejas"}, {id: 2, value: "Museus"}, {id: 3, value: "Pontes"}, {id: 4, value: "Estátuas"}];
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
    var statue = false;
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
      }else if(categories[i].id == 4){
        statue = true;
      }else{

      }
    }

    var definedRadius = $scope.distanceValue * 1000;

    console.log(definedRadius);

    var request_churches = {
      location: $scope.position,
      radius: definedRadius,
      query: 'igreja',
      type: 'church'
    };

    var request_museums = {
      location: $scope.position,
      radius: definedRadius,
      query: 'museu',
      type: 'museum'
    };

    var request_statues = {
      location: $scope.position,
      radius: definedRadius,
      query: 'estátua'
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

    //Call text search for museums
    if(statue)
      service.textSearch(request_statues, callback);

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
    console.log("LOCAIS");
    for(var i = 0; i < $scope.selectedLocals.length; i++){
      console.log($scope.selectedLocals[i]);
      markers.push(createMarker($scope.selectedLocals[i]));
    }
    MapMarkers.setLocations($scope.selectedLocals);

    $scope.selectTabWithIndex(0);
  }

  $scope.showRoutes = function () {
    for(var i = 0; i < markers.length; i++){
      if(typeof markers[i] === "undefined"){
        console.log("Entra!");
        markers.splice(i, 1);
        i--;
      }
    }
    console.log("MARKERS, ANTES MAPA");
    console.log(markers);
    console.log("LOCAIS, ANTES MAPA");
    console.log($scope.selectedLocals);
    MapMarkers.setMarkers(markers);
    MapMarkers.setActualPosition($scope.position);
    $state.go('menu.map');
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
function ($scope) {
  $scope.hideSignupLogin = function() {
    var logged = sessionStorage.getItem('logged');
    if(logged == null) {
      $scope.showSignup = true;
      $scope.showLogin = true;
    }
    else {
      $scope.showSignup = false;
      $scope.showLogin = false;
    }
  };
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

          if($scope.response=="Successo") {
            $scope.title="Account Created!";
            $scope.template="Your account has been successfully created!";

            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack:true
            });

            $state.go('menu.login', {}, {location: "replace", reload: true});
          }
          else {
            $scope.title="Erro";
            $scope.template="Username ja existe!";
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

        if($scope.response=="Sucesso") {
          $scope.title="Logged in!";
          $scope.template="Fez log in com sucesso!";
          sessionStorage.setItem('user_id', res.data.data[0].user_id);
          sessionStorage.setItem('name', res.data.data[0].name);
          sessionStorage.setItem('username', res.data.data[0].username);
          sessionStorage.setItem('logged', true);


          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack:true
          });

          $state.go('menu.home', {}, {location: "replace", reload: true});
        }
        else {
          $scope.title="Erro";
          $scope.template="Utilizador/Password errados";
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
    delete sessionStorage.logged;

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
  $scope.$on('$ionicView.enter', function() {
    var logged = sessionStorage.getItem('logged');
    $scope.user_id= sessionStorage.getItem('user_id');
    $scope.name= sessionStorage.getItem('name');
    $scope.username= sessionStorage.getItem('username');
    if(logged == null) {
      $state.go('menu.login', {}, {location: "replace", reload: true});
    }
  });
  console.log($scope.user_id);
  console.log($scope.name);
  console.log($scope.username);
    $scope.edit = function (data) {
      var link = "http://monrarium.herokuapp.com/api/users/"
      $http.put(link + $scope.user_id, {name: data.name, username: $scope.username})
        .then(function (res) {
          $scope.response = res.data.status;
          console.log($scope.response);

          if ($scope.response == "Sucesso") {
            $scope.title = "Nome editado com sucesso!";
            $scope.template = "O seu nome foi editado com sucesso!";
            sessionStorage.setItem('name', data.name);

            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
            });

            $state.go('menu.myProfile', {}, {location: "replace", reload: true});
          }
          else {
            $scope.title = "Erro";
            $scope.template = "Não foi possivel editar o nome!";
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
  .controller('myRoutesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])
.controller('mapCtrl', function($scope, $state, $cordovaGeolocation, MapMarkers, Location) {

  $scope.finishedRequest = false;
  $scope.mapmarkers = MapMarkers.getMarkers();
  $scope.position = MapMarkers.getActualPosition();
  $scope.locations = MapMarkers.getLocations();
  console.log("MARKERS, DEPOIS MAPA");
  console.log($scope.mapmarkers);
  console.log("LOCAIS, DEPOIS MAPA");
  console.log($scope.locations);

  $scope.waypoints = [];
  var map;

  console.log("AQUI É O MAPA!!!");
  console.log($scope.mapmarkers);
  console.log($scope.position);
  var origin1 = $scope.position;

  var destinations = [];

  for(var i = 0; i < $scope.mapmarkers.length; i++){
    if(typeof $scope.mapmarkers[i] !== 'undefined')
      destinations.push($scope.mapmarkers[i].position);
  }

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: destinations,
      travelMode: 'WALKING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }, callback);

  function callback(response, status) {
    if (status == 'OK') {
      var origins = response.originAddresses;

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = {
            location: destinations[j],
            distanceText: results[j].distance.text,
            distance: results[j].distance.value,
            durationText: results[j].duration.text,
            duration: results[j].duration.value};
          $scope.waypoints.push(element);
        }
        $scope.waypoints.sort(function(a, b){return a.distance-b.distance});
        console.log($scope.waypoints);
      }
    }
    initMap();
  }

  function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.orderedLocations = MapMarkers.orderLocations($scope.waypoints, $scope.locations);

    map = new google.maps.Map(document.getElementById('map2'), {
      center: $scope.position,
      zoom: 15
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    for (var i = 0; i < $scope.waypoints.length - 1; i++) {
        waypts.push({
          location: $scope.waypoints[i].location,
          stopover: true
        });
    }
    directionsService.route({
      origin: $scope.position,
      destination: $scope.waypoints[$scope.waypoints.length - 1].location,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        google.maps.event.trigger(map, 'resize');

        $scope.data = [];
        console.log($scope.finishedRequest);
        console.log($scope.data);
        for(var i = 0; i < $scope.orderedLocations.length; i++){
          $scope.data.push({location : $scope.orderedLocations[i], waypoint : $scope.waypoints[i], route : response.routes[0].legs[i]});
        }

        $scope.finishedRequest = true;
        console.log($scope.finishedRequest);
        console.log($scope.data);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          console.log(route.legs[i]);
          //summaryPanel.innerHTML += '<button id="locationButton ' + (i+1) + '" class="button button-block button-positive icon ion-navigate"  ng-click="">' + $scope.locations[i].name + '</button>'
          /*summaryPanel.innerHTML += '<b>Route Segment: ' + $scope.locations[i].name +
            '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';

          summaryPanel.innerHTML += '<b>Steps: ' +
            '</b><br>';

          for(var j = 0; j < route.legs[i].steps.length; j++){
            summaryPanel.innerHTML += "Step " + (j+1) + '<br>';
            summaryPanel.innerHTML += route.legs[i].steps[j].instructions + '<br>';
          }
          */
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  $scope.openDirections = function (index){

    console.log($scope.data[index]);
  }

})

.controller('preferencesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaGeolocation, MapMarkers, Location) {

  //$scope.location =

}])
