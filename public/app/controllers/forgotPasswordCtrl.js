(function(){
'use strict';
	var app = angular.module('donup');
    app.controller('ForgotPasswordCtrl',['$scope',function($scope){
    	$scope.user={};
       $scope.sendPassword = function(){
       		$scope.user.username;
         alert("service request to "+$scope.user.username);
        }
    }]);
  })();