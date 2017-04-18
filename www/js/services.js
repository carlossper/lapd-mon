angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('MapMarkers', [function(){
  var markers = [];
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
    }
  };
}])

.service('BlankService', [function(){

}]);
