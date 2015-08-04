  (function(){
	  'use strict';
	    var app = angular.module('donup');
    app.controller('UserCtrl',['$scope','UserService','$location',function($scope,userService,$location){
        //Models    
        $scope.user = {};
        $scope.isUserRegistered = false;
		$scope.message;
        $scope.userToken;
    
    
        $scope.registerUser = function(){
            userService.registerUser($scope.user).success(function(data) {
				if(data.message == 'User created!'){
					$scope.isUserRegistered = true;
				}
				$scope.message=data.message;
            });
        }
        
        $scope.loginUser = function(){
            userService.loginUser($scope.user).success(function(data) {
				if(data.success == true){
					$scope.userToken = data.token;
                    $location.path('/');
				}
                $scope.message = data.message;				
            });
        }
    }]);
  })();