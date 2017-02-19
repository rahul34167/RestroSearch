var app = angular.module('RestroSearch', ['gm']);



 app.filter('split', function() {
        return function(input, splitChar) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
      });

app.controller('SearchRestaurant', function($scope, $http) {


  $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
      var location = $scope.searchLocation.getPlace().geometry.location;
      $scope.lat = location.lat();
      $scope.lng = location.lng();
      $scope.$apply();
      getRestaurants();
  });


$scope.locationArray = [];


$scope.drawOnMaps = function(restaurantObject)
{

    var locationObject = restaurantObject.restaurant.location;
    var latLang = new google.maps.LatLng(locationObject.latitude, locationObject.longitude);

    $scope.locationArray.push(latLang);

    var restaurantTitle =  restaurantObject.restaurant.name;
    
      var marker = new Marker({
        map : $scope.map,
        position : latLang,
        title : restaurantTitle,
           icon: {
        path: SQUARE_PIN,
        fillColor: '#00CCBB',
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0
      },
      map_icon_label: '<span class="map-icon map-icon-restaurant"></span>'

      });

      $scope.markers.push(marker);

      $scope.map.setCenter(latLang);


};



$scope.drawPolygon = function()
{

var flightPath = new google.maps.Polyline({
    path: $scope.locationArray,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap($scope.map);


}



// function to update search when user clicks on actor or director name
 $scope.updateVar = function (event) {
        $scope.searchQuery = angular.element(event.target).text().replace(/,|and/g, '').trim();
        getMovieResults();
        $scope.titleResult = [];
        $scope.directorResult=[];
        $scope.actorResult=[];
    };

    $scope.convertToArray = function(actorString,nb)
    {
      var array = actorString.split(',');
      $scope.actors = array;
    }

    function getRestaurants () {


          $scope.markers = [];

                  var req = {
           method: 'GET',
           url: 'https://developers.zomato.com/api/v2.1/geocode?lat='+$scope.lat+'&lon='+$scope.lng,
           headers: {
             'user-key': 'd64e3f9a55c8c67eefc09233ef729d63'
           }
          }

          $http(req).then(function(response)
            {
              console.log(response);
              $scope.restaurantResult = response.data.nearby_restaurants; 


                var userLocation = new google.maps.LatLng($scope.lat, $scope.lng);
                var userTitle="SearchLocation";

                      var mapOptions = {
                      zoom : 80,
                      center : userLocation,
                      mapTypeId : google.maps.MapTypeId.TERRAIN
                    }

                    $scope.map = new google.maps.Map(document.getElementById('map'),
                        mapOptions);


                                 var marker = new Marker({
                      map : $scope.map,
                      position : userLocation,
                      title : userTitle,
                         icon: {
                      path: SHIELD,
                      fillColor: '#642bb1',
                      fillOpacity: 1,
                      strokeColor: '',
                      strokeWeight: 0
                    },
                    map_icon_label: '<span class="map-icon map-icon-cafe"></span>'

                    });

                    $scope.markers.push(marker);


            }, 
            function()
            {
              console.log("result not found");
            }); 
    }

    /**
     * binded to @user input form
     */
    $scope.fetchFromZomato = function () {

     $scope.restaurantResult = [];
     $scope.markers = [];
     /* $scope.directorResult=[];
      $scope.actorResult=[];
      $scope.movietitle = 'False';
      $scope.director = 'False';
      $scope.actor = 'False';*/
      getRestaurants();
    }

    
});