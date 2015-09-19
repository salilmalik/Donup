(function() {
  'use strict';
  var app = angular.module('donup');
  app.controller('DisplayImageCtrl', [ '$scope', 'ImageService', '$location',
      '$cookies', function($scope, imageService, $location) {
           alert("Display Image Controller called.");
        $scope.user = {};
displayImage();
         function displayImage(){
             alert("Display Image Controller called 2.");
         $scope.dataLoading = true;
         imageService.displayImage($scope.user).success(function(data) {

          $scope.result=data;
          alert("$scope.result"+$scope.result);
          console.log(JSON.stringify($scope.result));
            });
        }

      } ]);
})();