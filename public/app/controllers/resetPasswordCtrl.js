(function(){
'use strict';
	var app = angular.module('donup');
    app.controller('ResetPasswordCtrl',['$scope',function($scope){
    	alert("reset password");
    	$scope.user={};
       $scope.sendPassword = function(){
       		$scope.user.username;
         alert("service request to "+$scope.user.username);
        }
    }]);
  })();