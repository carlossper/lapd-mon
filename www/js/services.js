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
        console.log("ORDERNADO");
        console.log(newLocations);
        return newLocations;
      }
    };
  }])

  .factory('Location', [function(){
    var location;
    var marker;

    return{
      getLocation: function () {
        return location;
      },
      setLocation: function (l) {
        location = l;
      },
      getMarker: function () {
        return marker;
      },
      setMarker: function(m){
        marker = m;
      }
    };
  }])

  .service('BlankService', [function(){

  }]);
