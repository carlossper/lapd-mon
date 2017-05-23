angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('MapMarkers', [function(){
  var markers = [];
  var locations = [];
  var actualPosition;
  return {
    getMarkers: function () {
      return markers;
    },
    setMarkers: function (mapmarkers) {
      markers = mapmarkers;
    },
    getActualPosition: function () {
      return actualPosition;
    },
    setActualPosition: function (position) {
      actualPosition = position;
    },
    getLocations: function () {
      return locations;
    },
    setLocations: function (l) {
      locations = l;
    },
    orderLocations: function(m, l){
      var newLocations = [];
      for(var i = 0; i < m.length; i++){
        for(var j = 0; j < l.length; j++){
          if(m[i].location == l[j].location){
            newLocations.push(l[j]);
          }
        }
      }
      return newLocations;
    },
  };
}])

.factory('Location', [function(){
  var data = [];
  var route = [];
  var index;

  return{
    getData: function () {
      return data;
    },
    setData: function (d) {
      data = d;
    },
    getRoute: function () {
      return route;
    },
    setRoute: function(r){
      route = r;
    },
    limitRoute: function(index){

      var newvar = route.geocoded_waypoints.slice(index, index + 2);
      return newvar;
    },
    getIndex: function () {
      return index;
    },
    setIndex: function(i){
      index = i;
    }
  };
}])

.service('BlankService', [function(){

}]);
