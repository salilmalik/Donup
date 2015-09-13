  (function(){
	  'use strict';
	    var app = angular.module('donup');
         app.controller('DisplayImageCtrl',['$scope','ImageService','$location','$cookies',function($scope,imageService,$location){
          
        $scope.user = {};
      
        $scope.displayImage = function(){
            userService.displayImage($scope.user).success(function(data) {
                $scope.dataLoading = true;
				if(data.success == true){
                   
				}
            
            });
        }
        
    }]);
  })();