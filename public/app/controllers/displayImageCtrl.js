(function() {
  'use strict';
  var app = angular.module('donup');
  app.controller('DisplayImageCtrl', [
      '$scope',
      'ImageService',
      '$location',
      '$cookies',
      '$routeParams',
      '$route',
      function($scope, imageService, $location, $routeParams, $route) {

        displayImage();
        function displayImage() {
          $scope.dataLoading = true;
          imageService.getImage($route.param).success(function(data) {
            $scope.image = data;
            $scope.img = $scope.image.img.substring(8);
            $scope.imgtn = $scope.image.imgtn.substring(8);
          });
        }
        $scope.doThis = function() {
          imageService.updatePoints($route.param).success(
              function(data) {
              });

        }
      } ]);
  app.directive('imageonload', [ 'ImageService', '$route',
      function(imageService, $route) {
        return {
          restrict : 'A',
          link : function(scope, element, attrs) {
            element.bind('load', function() {
              scope.$apply(attrs.imageonload);
            });

          }
        };
      } ]);
})();
