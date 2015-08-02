  (function(){
	  'use strict';
	    var app = angular.module('donup');
    app.controller('UserCtrl',['$scope','UserService',function($scope,userService){
        //Models    
        $scope.user = {};
        $scope.isUserRegistered = false;
		$scope.message;
    
    
        $scope.registerUser = function(){
            userService.registerUser($scope.user).success(function(data) {
				if(data.message == 'User created!'){
					$scope.isUserRegistered = true;
				}
				$scope.message=data.message;
            });
        }
    }]);
  })();