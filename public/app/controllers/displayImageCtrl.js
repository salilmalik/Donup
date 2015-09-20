(function() {
  'use strict';
  var app = angular.module('donup');
  app.controller('DisplayImageCtrl', [ '$scope', 'ImageService', '$location',
      '$cookies', '$routeParams', '$route',
      function($scope, imageService, $location, $routeParams, $route) {

        displayImage();
        function displayImage() {
          alert("Display Image Controller called." + $route.param);
          $scope.dataLoading = true;
          imageService.getImage($route.param).success(function(data) {
            $scope.image = data;
            $scope.img = $scope.image.img.substring(8);
            $scope.imgtn = $scope.image.imgtn.substring(8);
          });
        }
      } ]);
})();